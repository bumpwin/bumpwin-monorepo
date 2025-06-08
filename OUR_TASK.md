# Effect-ts アンチパターン撲滅プロジェクト - 関数型プログラミング完全準拠

## 🎯 目標
プロジェクト全体のEffect-tsアンチパターンを根絶し、関数型プログラミングのベストプラクティスに完全準拠

## 🚨 発見されたアンチパターン - 巡回調査結果

### 📊 現状分析（詳細巡回完了）
| カテゴリ | 問題ファイル数 | アンチパターン件数 | 重要度 |
|---------|-------------|------------------|--------|
| **エラー定義** | 2ファイル | 2件 | **Critical** |
| **依存注入** | 5ファイル | 8件 | **Critical** |
| **Effect使用** | 6ファイル | 7件 | **High** |
| **副作用処理** | 8ファイル | 12件 | **Medium** |
| **総計** | **21ファイル** | **29件** | **即座対応要** |

### 🔍 Critical アンチパターン詳細

#### **エラー定義二重記述 (Critical)**
- `packages/utils/src/errors.ts:2-54` - 型とファクトリー別々定義
- `apps/cmd/src/utils/errors.ts:4-123` - 同様の二重記述パターン

#### **依存注入違反 (Critical)**  
- `apps/cmd/src/jobs/insertChat.ts:5-6` - グローバルsupabase/logger直接インポート
- `apps/cmd/src/jobs/listenChatEvent.ts:2` - グローバル依存
- `packages/api/src/chat.ts:9` - ミュータブルグローバル状態
- `apps/cmd/src/utils/logger.ts:4` - グローバルconfig使用
- `apps/cmd/src/services/supabase.ts:169` - グローバルエクスポート

#### **直接throw使用 (High)**
- `apps/web/src/config.ts:15,28` - Effect.fail()代わりに直接throw
- `packages/utils/src/validation.ts:67-71` - 同期バリデーションでthrow
- `packages/supabase/src/auth.ts:30,34` - 非同期関数内でthrow

## 📋 実装計画

### Phase 1: エラー型システム完全刷新 (60分・Critical)
**優先度**: Critical | **工数**: 60分 | **対象**: 2ファイル 2件のアンチパターン

#### 1.1 重大なエラー定義アンチパターン修正 (35分)
- [ ] **`packages/utils/src/errors.ts` 完全書き換え (20分)**
  - 型とファクトリーの二重記述を実装優先型推論に変更
  - 54行の重複コードを削減、型安全性向上
- [ ] **`apps/cmd/src/utils/errors.ts` 完全書き換え (15分)**
  - 123行の重複パターンを統一
  - ValidationError, AppError等の二重記述除去

#### 1.2 既存参照箇所の更新 (15分)
- [ ] **全ファイルでのエラー参照を新パターンに更新**
  ```typescript
  // ✅ 推奨: 実装優先型推論パターン
  const AppErrors = {
    transaction: (message: string, cause?: unknown) => ({
      _tag: "TransactionError" as const,
      message,
      cause
    }),
    wallet: (message: string, cause?: unknown) => ({
      _tag: "WalletError" as const,
      message,
      cause
    }),
    network: (message: string, cause?: unknown) => ({
      _tag: "NetworkError" as const,
      message,
      cause
    }),
    validation: (message: string, field?: string, cause?: unknown) => ({
      _tag: "ValidationError" as const,
      message,
      field,
      cause
    })
  } as const

  type AppError = ReturnType<typeof AppErrors[keyof typeof AppErrors]>
  ```

#### 1.2 既存エラーハンドリング更新 (15分)
- [ ] **`/apps/web/src/hooks/transactions/useExecuteTransaction.ts` 更新**
  ```typescript
  // ✅ 実装優先型推論適用
  const TransactionErrors = {
    preparation: (cause: unknown) => ({
      _tag: "TransactionPreparationError" as const,
      cause
    }),
    walletNotConnected: () => ({
      _tag: "WalletNotConnectedError" as const
    }),
    execution: (message: string, cause: unknown) => ({
      _tag: "TransactionExecutionError" as const,
      message,
      cause
    })
  } as const

  type TransactionError = ReturnType<typeof TransactionErrors[keyof typeof TransactionErrors]>
  ```

#### 1.3 型安全性検証 (10分)
- [ ] **TypeScriptコンパイルエラー0件確認**
- [ ] **catchTag使用箇所の型安全性確認**

### Phase 2: 依存注入システム構築 (90分・Critical)
**優先度**: Critical | **工数**: 90分 | **対象**: 5ファイル 8件のアンチパターン

#### 2.1 グローバル依存の依存注入化 (50分)
- [ ] **`apps/cmd/src/jobs/insertChat.ts` 依存注入化 (15分)**
  - グローバルsupabase/logger直接インポートをContext/Layer化
- [ ] **`apps/cmd/src/jobs/listenChatEvent.ts` 依存注入化 (10分)**
  - グローバル依存をContext経由に変更
- [ ] **`packages/api/src/chat.ts` 状態管理修正 (10分)**
  - ミュータブルグローバル状態をEffect管理に変更
- [ ] **`apps/cmd/src/utils/logger.ts` サービス化 (10分)**
  - グローバルconfig使用をContext/Layer化
- [ ] **`apps/cmd/src/services/supabase.ts` 修正 (5分)**
  - グローバルエクスポート除去、Layer専用化

#### 2.2 Context/Layer実装統合 (25分)
- [ ] **統合Layerの作成**
  ```typescript
  import { Context, Effect, Layer } from "effect"
  import { createClient, type SupabaseClient } from "@supabase/supabase-js"

  // ✅ Context定義
  interface SupabaseService {
    readonly client: SupabaseClient
  }

  const SupabaseService = Context.GenericTag<SupabaseService>("SupabaseService")

  // ✅ Layer実装
  const SupabaseServiceLayer = Layer.effect(
    SupabaseService,
    Effect.gen(function* () {
      const config = yield* Effect.service(Config)
      const client = createClient(config.env.SUPABASE_URL, config.env.SUPABASE_ANON_KEY)
      return { client }
    })
  )

  // ✅ 使用例
  const insertChat = (chatData: ChatData) =>
    Effect.gen(function* () {
      const supabase = yield* Effect.service(SupabaseService)
      const result = yield* Effect.tryPromise({
        try: () => supabase.client.from("chats").insert(chatData),
        catch: (error) => AppErrors.database("Failed to insert chat", error)
      })
      return result
    })
  ```

#### 2.2 Config Context/Layer実装 (20分)
- [ ] **`/apps/cmd/src/config/index.ts` Context/Layer化**
  ```typescript
  // ✅ Config Context定義
  interface ConfigService {
    readonly config: Config
  }

  const ConfigContext = Context.GenericTag<ConfigService>("ConfigService")

  // ✅ Config Layer実装
  const ConfigLayer = Layer.effect(
    ConfigContext,
    Effect.gen(function* () {
      yield* Effect.sync(() => dotenv.config())
      
      const env = yield* Effect.try({
        try: () => envSchema.parse(process.env),
        catch: (error) => ConfigErrors.validation(error as z.ZodError)
      })

      const config: Config = {
        env,
        isDevelopment: env.NODE_ENV === "development",
        isProduction: env.NODE_ENV === "production", 
        isTest: env.NODE_ENV === "test"
      }

      return { config }
    })
  )
  ```

#### 2.3 依存注入統合 (15分)
- [ ] **全サービスのContext/Layer統合**
  ```typescript
  // ✅ 全サービス統合Layer
  const AppLayer = Layer.merge(ConfigLayer, SupabaseServiceLayer)

  // ✅ アプリケーション実行
  const program = Effect.gen(function* () {
    const result = yield* insertChat(chatData)
    yield* logger.info(`Chat inserted: ${result.id}`)
    return result
  })

  Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
  ```

### Phase 3: 直接throw除去とEffect使用パターン修正 (45分・High)
**優先度**: High | **工数**: 45分 | **対象**: 9ファイル 10件のアンチパターン

#### 3.1 直接throw使用の修正 (20分)
- [ ] **`apps/web/src/config.ts:15,28` Effect.fail()化 (5分)**
  - 直接throwをEffect.fail()に変更
- [ ] **`packages/utils/src/validation.ts:67-71` Effect化 (10分)**
  - 同期バリデーションをEffect.try使用に変更
- [ ] **`packages/supabase/src/auth.ts:30,34` Effect化 (5分)**
  - 非同期関数内throwをEffect.fail()に変更

#### 3.2 Effect使用パターン修正 (25分)
- [ ] **`apps/web/src/app/rounds/components/ClaimOutcomeDialog.tsx` Effect化 (10分)**
  - try/catchをEffect.try使用に変更
- [ ] **`packages/sui/src/movecall.ts` Promise→Effect変換 (10分)**
  - Promiseコンストラクタ→Effect.async変換
- [ ] **`packages/questdb/src/pool.ts` リソース管理Effect化 (5分)**
  - withConn関数をEffect.acquireUseReleaseに変更
  ```typescript
  // ❌ 削除: ハードコードデフォルト値
  // SUPABASE_URL: z.string().default("http://127.0.0.1:54321")

  // ✅ 必須化
  const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().transform(Number).default("4000"),
    LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS: z.string().transform(Number).default("5000"),
    INSERT_CHAT_INTERVAL_MS: z.string().transform(Number).default("2000"),
    SUPABASE_URL: z.string().min(1, "SUPABASE_URL is required"),
    SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required")
  })
  ```

#### 3.2 設定エラーハンドリング改善 (15分)
- [ ] **設定読み込みエラーの型安全化**
  ```typescript
  const ConfigErrors = {
    validation: (errors: z.ZodError) => ({
      _tag: "ConfigValidationError" as const,
      errors: errors.errors,
      message: errors.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    }),
    loading: (cause: unknown) => ({
      _tag: "ConfigLoadError" as const,
      cause
    })
  } as const

  type ConfigError = ReturnType<typeof ConfigErrors[keyof typeof ConfigErrors]>
  ```

### Phase 4: 副作用処理のEffect化 (60分・Medium)
**優先度**: Medium | **工数**: 60分 | **対象**: 8ファイル 12件のアンチパターン

#### 4.1 副作用のEffect.sync化 (35分)
- [ ] **`apps/web/src/components/chat/ChatPanel.tsx` console.log修正 (10分)**
  - 5箇所のconsole操作をEffect.sync化
- [ ] **`apps/web/src/app/debug-tx/page.tsx` DOM操作修正 (10分)**
  - document.getElementByIdをEffect.sync化
- [ ] **`apps/web/src/utils/supabaseClient.ts` console修正 (5分)**
  - process.env直接アクセスとconsole.errorをEffect化
- [ ] **その他ファイルの副作用修正 (10分)**
  - 残り5ファイルの副作用をEffect.sync化

#### 4.2 タイマー・イベント管理のEffect化 (25分)
- [ ] **`apps/web/src/components/battle/BattleClock.tsx` タイマー修正 (10分)**
  - setInterval/clearIntervalをEffect.acquireUseRelease化
- [ ] **`apps/web/src/components/charts/chart/lwc-chart.tsx` イベント修正 (10分)**
  - window.addEventListener管理をEffect化
- [ ] **`apps/cmd/src/jobs/insertChat.ts` プロセス管理修正 (5分)**
  - process.on()操作をEffect化
  ```typescript
  // ✅ エラーハンドリング集約パターン
  const useTransaction = () => {
    const executeTransaction = (tx: Transaction) =>
      Effect.gen(function* () {
        const user = yield* fetchUser(id)
        const profile = yield* fetchProfile(id) 
        const settings = yield* fetchSettings(id)
        return { user, profile, settings }
      }).pipe(
        // すべてのエラーハンドリングを末尾に集約
        Effect.catchTag("NotFoundError", (error) => 
          Effect.succeed({ success: false, error: "RESOURCE_NOT_FOUND", resource: error.resource })
        ),
        Effect.catchTag("DatabaseError", (error) =>
          Effect.succeed({ success: false, error: "DATABASE_UNAVAILABLE", details: error.message })
        ),
        Effect.catchAll((error) =>
          Effect.succeed({ success: false, error: "UNKNOWN_ERROR", message: String(error) })
        )
      )
  }
  ```

#### 4.2 Effect.gen統一 (15分)
- [ ] **Effect.gen使用の統一**
  ```typescript
  // ✅ Effect.gen統一パターン
  const robustProgram = Effect.gen(function* () {
    const config = yield* Effect.service(Config)
    const supabase = yield* Effect.service(SupabaseService)
    const logger = yield* Effect.service(Logger)
    
    yield* logger.info("Starting operation")
    const result = yield* supabase.client.from("table").select()
    yield* logger.info(`Operation completed: ${result.length} items`)
    
    return result
  })
  ```

## 🧑‍💻 後続LLM向け実装ガイド

### 📚 必須知識ゼロからの学習パス

#### Step 1: Effect-ts基本概念理解 (15分)
```typescript
// Effect<R, E, A> 基本構造
Effect<Requirements, Error, Success>
//     │           │      └─ 成功時の値の型
//     │           └──────── エラーの型  
//     └─────────────────── 必要な依存関係の型

// 具体例
Effect<Database, DatabaseError, User>
//     │         │               └─ 成功時: User
//     │         └─────────────── 失敗時: DatabaseError  
//     └───────────────────────── 必要: Database service
```

#### Step 2: アンチパターン識別法 (10分)
```typescript
// ❌ BAD: 二重記述
type UserError = { _tag: "ValidationError"; field: string }
const createUserError = (field: string): UserError => ({ _tag: "ValidationError", field })

// ✅ GOOD: 実装優先型推論
const UserErrors = {
  validation: (field: string) => ({ _tag: "ValidationError" as const, field })
} as const
type UserError = ReturnType<typeof UserErrors[keyof typeof UserErrors]>
```

#### Step 3: Context/Layer実装パターン (20分)
```typescript
// ✅ 標準パターン
interface ServiceInterface {
  readonly method: (param: string) => Effect.Effect<never, ServiceError, Result>
}

const ServiceTag = Context.GenericTag<ServiceInterface>("ServiceName")

const ServiceLayer = Layer.succeed(ServiceTag, {
  method: (param) => Effect.succeed(processParam(param))
})

// 使用
const program = Effect.gen(function* () {
  const service = yield* Effect.service(ServiceTag)
  return yield* service.method("input")
})
```

### 🔧 実装チェックリスト

#### 新規ファイル作成時
- [ ] エラー定義は実装優先型推論パターンを使用
- [ ] 依存関係はContext/Layerで注入
- [ ] Effect.genを使用して合成
- [ ] ハードコードデフォルト値を避ける

#### 既存ファイル修正時
- [ ] 二重記述パターンの除去
- [ ] グローバルシングルトンの依存注入化
- [ ] エラーハンドリング散乱の集約
- [ ] try/catch → Effect.try変換

### 🚫 絶対に避けるべきパターン

```typescript
// ❌ NEVER: 直接インポート依存
import { database } from "./database"
const result = database.query()

// ❌ NEVER: 二重記述
interface Error { _tag: string; message: string }
const createError = (message: string): Error => ({ _tag: "Error", message })

// ❌ NEVER: ハードコードデフォルト
const DEFAULT_URL = "http://localhost:3000"

// ❌ NEVER: エラーハンドリング散乱
fetchUser().pipe(Effect.catchTag("Error", handler))
fetchProfile().pipe(Effect.catchTag("Error", handler))  // 重複!
```

### ✅ 推奨パターンテンプレート

```typescript
// ✅ エラー定義テンプレート
const [ServiceName]Errors = {
  [errorType]: (param: Type) => ({
    _tag: "[ErrorName]" as const,
    param
  })
} as const

type [ServiceName]Error = ReturnType<typeof [ServiceName]Errors[keyof typeof [ServiceName]Errors]>

// ✅ サービス定義テンプレート
interface [ServiceName]Service {
  readonly [method]: (param: Type) => Effect.Effect<never, [ServiceName]Error, Result>
}

const [ServiceName]Service = Context.GenericTag<[ServiceName]Service>("[ServiceName]Service")

const [ServiceName]ServiceLayer = Layer.effect(
  [ServiceName]Service,
  Effect.gen(function* () {
    const config = yield* Effect.service(Config)
    return {
      [method]: (param) => Effect.succeed(processParam(param))
    }
  })
)

// ✅ 使用テンプレート
const program = Effect.gen(function* () {
  const service = yield* Effect.service([ServiceName]Service)
  const result = yield* service.[method](param)
  return result
}).pipe(
  Effect.catchTag("[ErrorName]", (error) => 
    Effect.succeed({ success: false, error: error._tag })
  ),
  Effect.provide([ServiceName]ServiceLayer)
)
```

## 📊 進捗指標 - 巡回調査結果ベース

### 成功基準
| 指標 | 現状 | 目標 |
|------|------|------|
| **総アンチパターン数** | **29件** | **0件** |
| **エラー定義二重記述** | 2箇所 | 0箇所 |
| **グローバル依存** | 8箇所 | 0箇所 |
| **直接throw使用** | 7箇所 | 0箇所 |
| **副作用未Effect化** | 12箇所 | 0箇所 |

### 品質指標
- [ ] **TypeScriptエラー**: 0件
- [ ] **Effect合成率**: 100%
- [ ] **依存注入率**: 100%
- [ ] **型安全性**: 完全

## ⚡ 緊急度・影響度マトリックス - 巡回結果ベース

| Phase | 対象 | 緊急度 | 影響度 | 工数 | 対応 |
|-------|------|--------|--------|------|------|
| **Phase 1** | エラー定義2件 | Critical | Critical | 60分 | 即座実行 |
| **Phase 2** | 依存注入8件 | Critical | Critical | 90分 | 即座実行 |
| **Phase 3** | Effect使用10件 | High | High | 45分 | 24h以内 |
| **Phase 4** | 副作用12件 | Medium | Medium | 60分 | 週内 |
| **合計** | **32件** | - | - | **255分** | **4.25時間** |

## 🎯 完了条件

### Phase完了基準 - 巡回結果対応
- [ ] **Phase 1**: 2ファイルのエラー定義が実装優先型推論パターン完了
- [ ] **Phase 2**: 5ファイル8箇所の依存注入がContext/Layer経由完了  
- [ ] **Phase 3**: 9ファイル10箇所の直接throw除去、Effect使用統一完了
- [ ] **Phase 4**: 8ファイル12箇所の副作用Effect化完了

### 最終検証項目
- [ ] **関数型純度**: 副作用の完全分離
- [ ] **型安全性**: TypeScript strict mode通過
- [ ] **合成可能性**: Effect.genによる合成
- [ ] **テスタビリティ**: 依存注入による分離

## 📈 期待効果

### 即効性のある効果
- **開発者体験**: 型安全性による自信ある開発
- **バグ削減**: ランタイムエラーの静的排除
- **保守性**: 関数型による予測可能性

### 長期的効果  
- **拡張性**: 合成による複雑性管理
- **品質**: 関数型による信頼性
- **チーム**: ベストプラクティスの共有

---

**実行準備完了** ✅  
**優先度**: Critical - 技術的負債の根本解決  
**開始**: Phase 1 エラー型システム刷新から即座実行

**後続LLM指導完了** 🎓  
**知識ゼロからの実装**: 完全ガイド提供済み 🚀