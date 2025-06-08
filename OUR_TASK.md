# Effect-ts アンチパターン残存対応 - 最終清掃フェーズ

## 🎯 目標
再評価で発見された残存アンチパターン5件の完全除去

## 🚨 発見された残存アンチパターン - 再評価結果

### 📊 現状分析（再評価完了）
| 重要度 | 件数 | ファイル数 | 工数見積 | 対応期限 |
|--------|------|---------|----------|----------|
| **Critical** | 1件 | 1ファイル | 10分 | 即座 |
| **High** | 3件 | 2ファイル | 15分 | 24h以内 |
| **Medium** | 1件 | 1ファイル | 5分 | 週内 |
| **総計** | **5件** | **4ファイル** | **30分** | **即座対応** |

### 🔍 Critical アンチパターン詳細

#### **グローバル環境変数アクセス (Critical)**
- `packages/api/src/chat.ts:123-126` - 直接process.env使用
  - Context/Layer依存注入を回避する重大設計違反
  - ハードコードデフォルト値 `"http://127.0.0.1:54321"` 使用
  - テスタビリティ・保守性の完全破綻

#### **非Effect化console使用 (High)**
- `packages/api/src/champions.ts:8,21` - production code内console.log
- `apps/web/src/utils/supabaseClient.ts:24-25,49-50` - Context経由でない環境変数アクセス

#### **構造化ログ一貫性欠如 (Medium)**
- `apps/web/src/lib/errors.ts:146,154` - Logger Service回避

## 📋 修正計画

### Phase 5: 残存アンチパターン完全除去 (30分・Critical)

#### 5.1 Critical: グローバル環境変数アクセス修正 (10分)
**対象**: `packages/api/src/chat.ts:123-126`

```typescript
// ❌ 削除対象: 直接process.env使用
export const chatApi = createChatApi(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

// ✅ 修正案: Context/Layer経由設定
interface ChatApiService {
  readonly api: OpenAPIHono;
}

const ChatApiService = Context.GenericTag<ChatApiService>("ChatApiService");

const ChatApiServiceLayer = Layer.effect(
  ChatApiService,
  Effect.gen(function* () {
    const config = yield* ConfigContext;
    
    // ✅ 必須環境変数の事前検証
    if (!config.config.env.NEXT_PUBLIC_SUPABASE_URL) {
      yield* Effect.fail(AppErrors.validation("NEXT_PUBLIC_SUPABASE_URL is required"));
    }
    if (!config.config.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      yield* Effect.fail(AppErrors.validation("NEXT_PUBLIC_SUPABASE_ANON_KEY is required"));
    }

    const api = createChatApi(
      config.config.env.NEXT_PUBLIC_SUPABASE_URL,
      config.config.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    return { api };
  })
);

// ✅ Effect管理下でのAPI取得
export const getChatApi = Effect.gen(function* () {
  const chatApiService = yield* ChatApiService;
  return chatApiService.api;
});
```

#### 5.2 High: 非Effect化console使用修正 (10分)
**対象**: `packages/api/src/champions.ts:8,21`

```typescript
// ❌ 削除対象: 直接console使用
console.log("Champions from getChampions():", champions);
console.log("Enriched champions:", enrichedChampions);

// ✅ 修正案: Effect組み込みログ使用（推奨）
export const championsApi = new OpenAPIHono()
  .get("/", async (c) => {
    const program = Effect.gen(function* () {
      const champions = getChampions();
      yield* Effect.logDebug("Champions from getChampions() - count: " + champions.length);

      const enrichedChampions = champions.map(({ round, meme }) => ({
        round,
        meme: meme ? { ...meme, ...mockMemeMarketData[meme.id] } : null,
      }));

      yield* Effect.logDebug("Enriched champions completed - count: " + enrichedChampions.length);
      return enrichedChampions;
    });

    const result = await Effect.runPromise(program);
    return c.json(result);
  });

// ✅ 代替案: カスタムLoggerService Context使用（詳細制御が必要な場合）
interface LoggerService {
  readonly info: (message: string, data?: unknown) => Effect.Effect<void>;
  readonly debug: (message: string, data?: unknown) => Effect.Effect<void>;
}

const LoggerService = Context.GenericTag<LoggerService>("LoggerService");

const LoggerServiceLayer = Layer.succeed(LoggerService, {
  info: (message: string, data?: unknown) => 
    Effect.sync(() => console.info(`[INFO] ${message}`, data)),
  debug: (message: string, data?: unknown) => 
    Effect.sync(() => console.debug(`[DEBUG] ${message}`, data)),
});
```

#### 5.3 High: Context経由でない環境変数アクセス修正 (5分)
**対象**: `apps/web/src/utils/supabaseClient.ts:24-25,49-50`

```typescript
// ❌ 削除対象: Effect内での直接process.env参照
export const createSupabaseClientEffect = Effect.gen(function* () {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // ...
});

// ✅ 修正案: Config Context経由
export const createSupabaseClientEffect = Effect.gen(function* () {
  const config = yield* ConfigContext;
  
  const supabaseUrl = config.config.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = config.config.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    yield* Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_URL"));
  }

  if (!supabaseAnonKey) {
    yield* Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
  }

  // URL検証もEffect.try使用
  yield* Effect.try({
    try: () => new URL(supabaseUrl),
    catch: () => SupabaseErrors.invalidUrl(supabaseUrl)
  });

  return createClient(supabaseUrl, supabaseAnonKey);
});
```

#### 5.4 Medium: Logger Service一貫性確保 (5分)
**対象**: `apps/web/src/lib/errors.ts:146,154`

```typescript
// ❌ 部分修正対象: 直接console使用
export const logError = (
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>,
): void => {
  console.error(fullContext, { ... });
};

// ✅ 修正案: Effect組み込みログ使用（推奨）
export const logErrorEffect = (
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>,
) => Effect.gen(function* () {
  const message = getErrorMessage(error);
  const fullContext = context ? `[${context}] ${message}` : message;

  if (isAppError(error)) {
    yield* Effect.logError(fullContext, {
      tag: error._tag,
      message: error.message,
      cause: error.cause,
      metadata,
      ...error,
    });
  } else {
    yield* Effect.logError(fullContext, { error, metadata });
  }
});

// ✅ 代替案: カスタムLoggerService使用（既存実装）
export const logErrorEffectWithService = (
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>,
) => Effect.gen(function* () {
  const logger = yield* LoggerService;
  const message = getErrorMessage(error);
  const fullContext = context ? `[${context}] ${message}` : message;

  if (isAppError(error)) {
    yield* logger.error(fullContext, {
      tag: error._tag,
      message: error.message,
      cause: error.cause,
      metadata,
      ...error,
    });
  } else {
    yield* logger.error(fullContext, { error, metadata });
  }
});

// 後方互換性のためのlegacy関数は残すが非推奨マーク
/** @deprecated Use logErrorEffect for new code */
export const logError = (
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>,
): void => {
  // Legacy implementation - 変更せず
  // ...
};
```

## 🔧 実装ガイド - 残存パターン対応

### 📚 Critical修正の重要ポイント

#### Context/Layer依存注入の完全実装
```typescript
// ✅ 必須パターン: 環境変数はConfig Context経由のみ
const ServiceLayer = Layer.effect(
  ServiceTag,
  Effect.gen(function* () {
    const config = yield* ConfigContext;  // ✅ Context経由必須
    
    // ✅ 事前検証 - fail fast原則
    if (!config.config.env.REQUIRED_VAR) {
      yield* Effect.fail(AppErrors.validation("REQUIRED_VAR is required"));
    }

    return createService(config.config.env.REQUIRED_VAR);
  })
);
```

#### Effect組み込みログ統一パターン
```typescript
// ✅ Effect組み込みログ使用（推奨）
const operation = Effect.gen(function* () {
  yield* Effect.logInfo("Operation started");
  const result = yield* performOperation();
  yield* Effect.logInfo("Operation completed", { resultId: result.id });
  
  return result;
});

// ✅ 代替: カスタムLogger Service使用（詳細制御が必要な場合）
const operationWithCustomLogger = Effect.gen(function* () {
  const logger = yield* LoggerService;
  
  yield* logger.info("Operation started");
  const result = yield* performOperation();
  yield* logger.info("Operation completed", { resultId: result.id });
  
  return result;
});
```

#### 副作用のEffect管理完全分離
```typescript
// ❌ NEVER: 直接副作用
console.log("Debug info");

// ✅ BEST: Effect組み込みログ
const debugLog = (message: string) => Effect.logDebug(message);

// ✅ ALTERNATIVE: Effect.sync経由
const customDebugLog = (message: string) => 
  Effect.sync(() => console.log(`[DEBUG] ${message}`));
```

### 🚫 残存回避すべきパターン

```typescript
// ❌ NEVER: 直接環境変数アクセス
const url = process.env.API_URL || "default";

// ❌ NEVER: ハードコードデフォルト
const DEFAULT_URL = "http://localhost:3000";

// ❌ NEVER: Effect外console使用
console.log("Production log");

// ❌ NEVER: カスタムLoggerService without justification
const unnecessaryLogger = Context.GenericTag<LoggerService>("LoggerService");

// ❌ NEVER: グローバルエクスポート
export const globalService = createService();
```

### ✅ 推奨最終パターン

```typescript
// ✅ Effect組み込みログ使用完全準拠サービス（推奨）
interface ServiceInterface {
  readonly method: (param: string) => Effect.Effect<Result, ServiceError>;
}

const ServiceTag = Context.GenericTag<ServiceInterface>("ServiceName");

const ServiceLayer = Layer.effect(
  ServiceTag,
  Effect.gen(function* () {
    const config = yield* ConfigContext;
    
    yield* Effect.logInfo("Service initializing");
    
    // 全ての設定検証
    const validatedConfig = yield* validateConfig(config);
    
    return {
      method: (param) => Effect.gen(function* () {
        yield* Effect.logDebug("Method called", { param });
        const result = yield* performOperation(param, validatedConfig);
        yield* Effect.logDebug("Method completed", { result });
        return result;
      })
    };
  })
);

// 使用パターン
const program = Effect.gen(function* () {
  const service = yield* ServiceTag;
  return yield* service.method("input");
}).pipe(
  Effect.provide(Layer.merge(ServiceLayer, ConfigLayer))
);

// ✅ カスタムLoggerService使用パターン（詳細制御が必要な場合）
const ServiceLayerWithCustomLogger = Layer.effect(
  ServiceTag,
  Effect.gen(function* () {
    const config = yield* ConfigContext;
    const logger = yield* LoggerService;
    
    yield* logger.info("Service initializing");
    
    const validatedConfig = yield* validateConfig(config);
    
    return {
      method: (param) => Effect.gen(function* () {
        yield* logger.debug("Method called", { param });
        const result = yield* performOperation(param, validatedConfig);
        yield* logger.debug("Method completed", { result });
        return result;
      })
    };
  })
);
```

## 📊 修正後の期待結果

### 完了基準
- [ ] **Critical 1件**: グローバル環境変数アクセス完全除去
- [ ] **High 3件**: console使用とContext回避の修正
- [ ] **Medium 1件**: Logger Service一貫性確保
- [ ] **TypeScriptエラー**: 0件維持
- [ ] **Effect合成率**: 100%達成

### 品質指標
| 指標 | 修正前 | 修正後目標 |
|------|--------|----------|
| **アンチパターン総数** | 5件 | **0件** |
| **Context/Layer使用率** | 95% | **100%** |
| **Effect管理副作用率** | 98% | **100%** |
| **型安全性** | 完全 | **完全維持** |

## ⚡ 実行優先度

| Phase | 対象 | 重要度 | 影響度 | 工数 | 実行順 |
|-------|------|--------|--------|------|--------|
| **Phase 5.1** | 環境変数アクセス1件 | Critical | Critical | 10分 | **1st** |
| **Phase 5.2** | console使用2件 | High | High | 10分 | **2nd** |
| **Phase 5.3** | Context回避1件 | High | High | 5分 | **3rd** |
| **Phase 5.4** | Logger一貫性1件 | Medium | Medium | 5分 | **4th** |

## 🎯 最終完了条件

### 技術的完了基準
- [ ] **依存注入**: 全てContext/Layer経由
- [ ] **環境変数**: Config Context経由のみ
- [ ] **ログ出力**: Logger Service経由のみ
- [ ] **副作用**: Effect.sync管理下のみ
- [ ] **エラー処理**: Effect.catchTag統一

### コード品質基準
- [ ] **関数型純度**: 100%達成
- [ ] **テスタビリティ**: 依存注入による完全分離
- [ ] **保守性**: パターン一貫性100%
- [ ] **型安全性**: strict mode通過

---

**最終清掃フェーズ準備完了** ✅  
**総工数**: 30分  
**開始**: Phase 5.1 Critical環境変数アクセス修正から即座実行  

### 🚨 最重要事項
**Phase 5.1は最優先**: グローバル環境変数アクセスはEffect-ts設計原則の根本違反。この修正により：
1. 完全な依存注入アーキテクチャ達成
2. テスタビリティの完全確保
3. 設定管理の一元化完成
4. **Effect-ts完全準拠プロジェクト**の達成

**30分で完全クリーン達成可能** 🚀