
# Effect-ts Complete Reference Guide
*最新版 - 後続LLM向けの完全ドキュメント*

## 🎯 設計哲学とコア概念

### **Effect-ts = ZIOのTypeScript移植 + JavaScript生態系最適化**

Effect-tsは**Scala ZIOの設計哲学**を基盤とし、TypeScriptの型システムとJavaScript生態系に最適化した関数型エフェクトライブラリです。

#### **核心価値**
- **型安全性**: ランタイムエラーの静的排除
- **合成可能性**: 小さなエフェクトから大きなアプリケーション構築
- **テスタビリティ**: 依存注入による完全な分離
- **パフォーマンス**: ファイバーベースの軽量並行性

## 📚 基本型システム

### **Effect<R, E, A> - コア型**

```typescript
Effect<R, E, A>
//     │  │  └─ Success Value Type (成功時の値の型)
//     │  └──── Error Type (エラーの型)
//     └─────── Requirements Type (必要な依存関係の型)

// 例
Effect<Database, DatabaseError, User>
//     │         │               └─ 成功時: User
//     │         └─────────────── 失敗時: DatabaseError
//     └───────────────────────── 必要: Database service
```

```mermaid
graph TB
    subgraph "Effect<R, E, A>"
        R["🔧 Requirements (R)<br/>必要な依存関係"]
        E["❌ Error (E)<br/>エラー型"]
        A["✅ Success (A)<br/>成功時の値"]
    end

    subgraph "具体例: Effect<Database, DatabaseError, User>"
        R1["Database Service<br/>データベース依存"]
        E1["DatabaseError<br/>DB接続エラーなど"]
        A1["User<br/>取得されたユーザー"]
    end

    R --> R1
    E --> E1
    A --> A1
```

### **主要な型バリエーション**

```typescript
// 依存なし、エラーなし
Effect<never, never, string>  // = Effect.succeed("hello")

// 依存あり、エラーなし
Effect<Config, never, string>  // = Effect.service(Config)

// 依存なし、エラーあり
Effect<never, ParseError, User>  // = Effect.fail(new ParseError())

// フル指定
Effect<Database & Logger, DatabaseError | ValidationError, User>
```

## 🔧 Effect 作成パターン

### **基本的なEffect作成**

```typescript
// 成功値
Effect.succeed(42)  // Effect<never, never, number>
Effect.succeed("hello")  // Effect<never, never, string>

// 失敗
Effect.fail(new Error("boom"))  // Effect<never, Error, never>

// 同期的計算
Effect.sync(() => Math.random())  // Effect<never, never, number>

// 非同期Promise変換
Effect.promise(() => fetch("/api/data"))  // Effect<never, never, Response>

// エラーハンドリング付きPromise
Effect.tryPromise({
  try: () => fetch("/api/data"),
  catch: (error) => new NetworkError(error.message)
})  // Effect<never, NetworkError, Response>
```

### **条件分岐とバリデーション**

```typescript
// 条件付きEffect
Effect.gen(function* (_) {
  const value = yield* _(Effect.succeed(10))

  if (value > 5) {
    return yield* _(Effect.succeed("big"))
  } else {
    return yield* _(Effect.fail(new Error("small")))
  }
})

// when/unless パターン
Effect.when(
  condition,
  () => someEffect  // conditionがtrueの時のみ実行
)

Effect.unless(
  condition,
  () => someEffect  // conditionがfalseの時のみ実行
)
```

## 🧬 Effect.gen - 合成の核心

### **基本パターン**

```typescript
// Scalaのfor-comprehensionをTypeScriptで再現
const program = Effect.gen(function* (_) {
  // _(yield) パターンで値を取り出し
  const config = yield* _(Effect.service(Config))
  const user = yield* _(fetchUser(config.userId))
  const posts = yield* _(fetchPosts(user.id))

  // 通常のJavaScript処理
  const summary = {
    user: user.name,
    postCount: posts.length,
    latestPost: posts[0]?.title || "No posts"
  }

  // 戻り値が成功値になる
  return summary
})
```

### **エラーハンドリングとEffect.gen**

```typescript
const robustProgram = Effect.gen(function* (_) {
  // エラーが発生する可能性のある操作
  const user = yield* _(
    fetchUser(userId).pipe(
      Effect.catchTag("NotFoundError", () =>
        Effect.succeed(createDefaultUser())
      )
    )
  )

  // 条件分岐
  if (user.isActive) {
    const data = yield* _(fetchActiveUserData(user.id))
    return processActiveUser(data)
  } else {
    const data = yield* _(fetchInactiveUserData(user.id))
    return processInactiveUser(data)
  }
})
```

## 🏷️ Class-Free エラーシステム

### **完全なミニマル例**

```typescript
// ✅ エラー定義：実装から型を推論、一度だけ定義
const UserErrors = {
  validation: (field: string, value: unknown) => ({
    _tag: "ValidationError" as const,
    field,
    value
  }),

  emailExists: (email: string) => ({
    _tag: "EmailExistsError" as const,
    email
  })
} as const

type UserError = ReturnType<typeof UserErrors[keyof typeof UserErrors]>

// ✅ 完全に動作する例
const createUser = (userData: { name: string; email: string }) =>
  Effect.gen(function* (_) {
    // バリデーション
    if (!userData.email.includes("@")) {
      return yield* _(Effect.fail(UserErrors.validation("email", userData.email)))
    }

    // 重複チェック（簡略化）
    if (userData.email === "admin@example.com") {
      return yield* _(Effect.fail(UserErrors.emailExists(userData.email)))
    }

    // 成功
    return { id: "user-123", ...userData }
  })

// ✅ エラーハンドリング
const handleUser = createUser({ name: "Alice", email: "invalid" }).pipe(
  Effect.catchTag("ValidationError", (error) =>
    Effect.succeed({ success: false, message: `${error.field} invalid: ${error.value}` })
  ),
  Effect.catchTag("EmailExistsError", (error) =>
    Effect.succeed({ success: false, message: `${error.email} already exists` })
  ),
  Effect.map(user => ({ success: true, data: user }))
)
```

### **環境変数読み取りのミニマル例（Zod統合）**

```typescript
import { z } from "zod"

// ✅ Zodスキーマ定義
const EnvSchema = z.object({
  DB_HOST: z.string().min(1, "DB_HOST cannot be empty"),
  DB_PORT: z.string().regex(/^\d+$/, "DB_PORT must be a number").transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_KEY: z.string().min(32, "API_KEY must be at least 32 characters")
})

type Config = z.infer<typeof EnvSchema>

// ✅ 設定エラー定義
const ConfigErrors = {
  validation: (errors: z.ZodError) => ({
    _tag: "ConfigValidationError" as const,
    errors: errors.errors,
    message: errors.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  })
} as const

type ConfigError = ReturnType<typeof ConfigErrors[keyof typeof ConfigErrors]>

// ✅ 環境変数読み取り
const getConfig = (): Effect.Effect<never, ConfigError, Config> =>
  Effect.try({
    try: () => EnvSchema.parse(process.env),
    catch: (error) => ConfigErrors.validation(error as z.ZodError)
  })

// ✅ エラーハンドリング
const safeConfig = getConfig().pipe(
  Effect.catchTag("ConfigValidationError", (error) =>
    Effect.succeed({
      success: false,
      error: `Configuration validation failed: ${error.message}`,
      details: error.errors
    })
  ),
  Effect.map(config => ({
    success: true,
    config: {
      database: { host: config.DB_HOST, port: config.DB_PORT },
      environment: config.NODE_ENV,
      apiKey: config.API_KEY
    }
  }))
)
```

## 🏗️ Layer/Context システム - 依存注入の核心

### **Context/Layer 概念図**

```mermaid
graph TD
    subgraph "Context (依存関係の宣言)"
        CT["Context.GenericTag<Logger>"]
        CI["interface Logger"]
    end

    subgraph "Layer (実装の提供)"
        LI["Layer Implementation"]
        LM["Layer.succeed(Logger, impl)"]
    end

    subgraph "Effect (依存関係の使用)"
        ES["Effect.service(Logger)"]
        EU["Effect使用: logger.info()"]
    end

    subgraph "Execution (実行時注入)"
        EP["Effect.provide(effect, layer)"]
        ER["実行結果"]
    end

    CI --> CT
    CT --> ES
    LI --> LM
    LM --> EP
    ES --> EU
    EU --> EP
    EP --> ER

    style CT fill:#e1f5fe
    style LM fill:#f3e5f5
    style ES fill:#e8f5e8
    style EP fill:#fff3e0
```

### **ミニマルな依存注入例**

```typescript
// ✅ サービス定義
interface Logger {
  readonly info: (message: string) => Effect.Effect<void>
}

const Logger = Context.GenericTag<Logger>("Logger")

// ✅ Layer作成
const LoggerLayer = Layer.succeed(Logger, {
  info: (message: string) => Effect.sync(() => console.log(`[INFO] ${message}`))
})

// ✅ 使用例
const greetUser = (name: string) =>
  Effect.gen(function* (_) {
    const logger = yield* _(Effect.service(Logger))
    yield* _(logger.info(`Hello, ${name}!`))
    return `Greeting sent to ${name}`
  })

// ✅ 実行
const program = Effect.provide(greetUser("Alice"), LoggerLayer)
```


## 🔄 並行・非同期プログラミング


### **並列実行のミニマル例**

```typescript
// ✅ 複数タスクの並列実行
const fetchMultipleUsers = (ids: string[]) =>
  Effect.collectAllPar(
    ids.map(id =>
      Effect.succeed({ id, name: `User-${id}`, email: `user${id}@example.com` })
        .pipe(Effect.delay(Math.random() * 1000)) // ランダム遅延でシミュレート
    )
  )

// ✅ レース実行（最初に完了したものを採用）
const fastestResponse = Effect.race(
  Effect.succeed("Primary").pipe(Effect.delay(1000)),
  Effect.succeed("Secondary").pipe(Effect.delay(1500))
) // "Primary" が返される

// ✅ タイムアウト付き実行
const withTimeout = Effect.timeout(
  Effect.succeed("Slow task").pipe(Effect.delay(2000)),
  1000 // 1秒でタイムアウト
) // None が返される
```

## ❌ Bad Patterns vs ✅ 推奨Patterns

### **エラーハンドリング戦略比較**

```mermaid
graph LR
    subgraph "❌ Bad: エラー散乱パターン"
        B1["fetchUser().catchTag()"]
        B2["fetchProfile().catchTag()"]
        B3["fetchSettings().catchTag()"]
        B4["重複したエラーハンドリング"]
    end

    subgraph "✅ Good: エラー集約パターン"
        G1["fetchUser()"]
        G2["fetchProfile()"]
        G3["fetchSettings()"]
        G4["単一のエラーハンドリング"]
    end

    B1 --> B4
    B2 --> B4
    B3 --> B4

    G1 --> G4
    G2 --> G4
    G3 --> G4

    style B4 fill:#ffebee
    style G4 fill:#e8f5e8
```

### **エラーハンドリング**

#### ❌ Bad: エラーハンドリング散乱
```typescript
const badProgram = Effect.gen(function* (_) {
  const user = yield* _(
    fetchUser(id).pipe(
      Effect.catchTag("NotFoundError", () => Effect.succeed(null))
    )
  )

  const profile = yield* _(
    fetchProfile(id).pipe(
      Effect.catchTag("NotFoundError", () => Effect.succeed(null)),
      Effect.catchTag("DatabaseError", () => Effect.fail(new Error("DB Error")))
    )
  )

  const settings = yield* _(
    fetchSettings(id).pipe(
      Effect.catchTag("NotFoundError", () => Effect.succeed(defaultSettings))
    )
  )
})
```

#### ✅ 推奨: エラーハンドリング集約
```typescript
const goodProgram = Effect.gen(function* (_) {
  const user = yield* _(fetchUser(id))
  const profile = yield* _(fetchProfile(id))
  const settings = yield* _(fetchSettings(id))

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
```

#### ❌ Bad: ts-pattern併用（アンチパターン）
```typescript
// Effect-tsの型安全性を破壊する悪例
import { match } from "ts-pattern"

const badErrorHandler = (error: unknown) => {
  return match(error)
    .with({ _tag: "ValidationError" }, (err) => /* 型情報消失 */)
    .with({ _tag: "NotFoundError" }, (err) => /* 型情報消失 */)
    .otherwise((err) => /* unknown型 */)
}

// Effect外でのエラー処理 = Effect-tsのエコシステム破綻
Effect.runPromise(program).catch(badErrorHandler)
```

#### ✅ 推奨: Effect-ts型安全エラーハンドリング
```typescript
// Effect内での完全な型安全性を保持
const safeErrorHandler = <R, E, A>(
  effect: Effect.Effect<R, E, A>
): Effect.Effect<R, never, { success: boolean; data?: A; error?: string }> =>
  effect.pipe(
    Effect.map(data => ({ success: true, data })),
    Effect.catchTag("ValidationError", (error) =>
      Effect.succeed({
        success: false,
        error: `Validation failed: ${error.field} - ${error.message}`
      })
    ),
    Effect.catchTag("NotFoundError", (error) =>
      Effect.succeed({
        success: false,
        error: `Resource not found: ${error.resource}`
      })
    ),
    Effect.catchTag("DatabaseError", (error) =>
      Effect.succeed({
        success: false,
        error: `Database operation failed: ${error.operation}`
      })
    ),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: `Unexpected error: ${String(error)}`
      })
    )
  )

// 使用例：完全な型安全性を維持
const handleRequest = safeErrorHandler(
  Effect.gen(function* (_) {
    const user = yield* _(userService.getUser("123"))
    const profile = yield* _(profileService.getProfile(user.id))
    return { user, profile }
  })
)
```

### **エラー型定義パターン比較**

```mermaid
graph TD
    subgraph "❌ Bad: 二重記述"
        BT["type UserError = { ... }"]
        BF["const UserErrors = { ... }"]
        BD["同じフィールドを2回定義"]
        BT --> BD
        BF --> BD
    end

    subgraph "✅ Good: 実装優先"
        GF["const UserErrors = { ... } as const"]
        GT["type UserError = ReturnType<...>"]
        GI["型推論で自動生成"]
        GF --> GI
        GI --> GT
    end

    style BD fill:#ffebee
    style GI fill:#e8f5e8
```

### **エラー型定義**

#### ❌ Bad: 二重記述（型 + ファクトリー）
```typescript
// 同じフィールドを2回定義
type UserError = {
  _tag: "ValidationError"
  field: string
  value: unknown
} | {
  _tag: "EmailExistsError"
  email: string
}

const UserErrors = {
  validation: (field: string, value: unknown): UserError => ({
    _tag: "ValidationError",
    field,    // 重複！
    value     // 重複！
  }),
  emailExists: (email: string): UserError => ({
    _tag: "EmailExistsError",
    email     // 重複！
  })
}
```

#### ✅ 推奨: 実装優先型推論
```typescript
// ファクトリーから型を推論、一度だけ定義
const UserErrors = {
  validation: (field: string, value: unknown) => ({
    _tag: "ValidationError" as const,
    field,
    value
  }),
  emailExists: (email: string) => ({
    _tag: "EmailExistsError" as const,
    email
  })
} as const

type UserError = ReturnType<typeof UserErrors[keyof typeof UserErrors]>
```

### **依存注入**

#### ❌ Bad: グローバル状態・直接インポート
```typescript
import { database } from "./database"
import { logger } from "./logger"

const createUser = (userData: CreateUserData) =>
  Effect.gen(function* (_) {
    // グローバル依存、テストが困難
    logger.info("Creating user")
    const result = yield* _(database.insert("users", userData))
    return result
  })
```

#### ✅ 推奨: Context/Layer依存注入
```typescript
interface Logger {
  readonly info: (message: string) => Effect.Effect<never, never, void>
}

interface Database {
  readonly insert: (table: string, data: CreateUserData) => Effect.Effect<never, DatabaseError, User>
}

const Logger = Context.GenericTag<Logger>("Logger")
const Database = Context.GenericTag<Database>("Database")

const createUser = (userData: CreateUserData) =>
  Effect.gen(function* (_) {
    // 型安全な依存注入
    const logger = yield* _(Effect.service(Logger))
    const database = yield* _(Effect.service(Database))

    yield* _(logger.info("Creating user"))
    const result = yield* _(database.insert("users", userData))
    return result
  })
// 型: Effect<Logger & Database, DatabaseError, User>
```

#### ❌ Bad: 外部ライブラリとの設計思想混在
```typescript
// ts-pattern等でEffect-tsの型安全性を破壊
import { match } from "ts-pattern"

const mixedApproach = Effect.gen(function* (_) {
  const result = yield* _(someEffect)

  // Effect-tsのエラーハンドリングを無視
  return match(result)
    .with({ status: "error" }, (err) => /* 型情報なし */)
    .otherwise((success) => /* 型情報なし */)
})
```

#### ✅ 推奨: Effect-ts一貫設計
```typescript
// Effect-ts内で完結した型安全設計
const consistentApproach = Effect.gen(function* (_) {
  const result = yield* _(someEffect)

  // Effect-tsの型システム内でパターンマッチング
  if (result.status === "error") {
    return yield* _(Effect.fail(UserErrors.processError(result.message)))
  }

  return result.data
}).pipe(
  Effect.catchTag("ProcessError", (error) =>
    Effect.succeed({ success: false, message: error.message })
  ),
  Effect.map(data => ({ success: true, data }))
)
```

### **副作用の扱い**

#### ❌ Bad: 直接的な副作用
```typescript
const badFileRead = (path: string) =>
  Effect.gen(function* (_) {
    // 同期的副作用を直接実行
    const content = fs.readFileSync(path, "utf8")
    return content
  })
```

#### ✅ 推奨: Effect.sync/tryでラップ
```typescript
const goodFileRead = (path: string) =>
  Effect.try({
    try: () => fs.readFileSync(path, "utf8"),
    catch: (error) => new FileSystemError(`Failed to read ${path}`, error)
  })
```

### **破綻した例の回避**

#### ❌ Bad: 未定義関数参照
```typescript
// 動作しない例
const example = Effect.gen(function* (_) {
  const user = yield* _(findUserById(id))        // ❌ 未定義
  const posts = yield* _(getUserPosts(user.id))  // ❌ 未定義
  return { user, posts }
})
```

#### ✅ 推奨: Self-contained例
```typescript
// 完全に動作する例
const example = Effect.gen(function* (_) {
  const user = { id: "123", name: "Alice" }  // ✅ 定義済み
  const posts = [{ id: "1", title: "Hello" }] // ✅ 定義済み
  return { user, posts }
})
```

## 🏛️ アーキテクチャパターンの選択

### **従来のRepository Pattern vs Effect-ts Service Pattern**

```mermaid
graph TD
    subgraph "❌ 従来のRepository Pattern（アンチパターン）"
        TR1["interface UserRepository"]
        TR2["class UserRepositoryImpl"]
        TR3["interface UserService"]
        TR4["class UserServiceImpl"]
        TR5["二重抽象化による冗長性"]

        TR1 --> TR2
        TR2 --> TR3
        TR3 --> TR4
        TR4 --> TR5
    end

    subgraph "✅ Effect-ts Service Pattern（推奨）"
        TS1["const UserService = Context.GenericTag"]
        TS2["const UserServiceLayer = Layer.succeed"]
        TS3["Effect.gen: yield* _(Effect.service(UserService))"]
        TS4["型安全 + 関数型 + 最小抽象化"]

        TS1 --> TS2
        TS2 --> TS3
        TS3 --> TS4
    end

    style TR5 fill:#ffebee
    style TS4 fill:#e8f5e8
```

### **なぜRepository PatternはEffect-ts環境でアンチパターンなのか**

#### ❌ **二重抽象化問題**
```typescript
// 不要な複雑性：Repository + Service 両方定義
interface UserRepository {
  findById: (id: string) => Promise<User | null>
  save: (user: User) => Promise<void>
}

interface UserService {
  getUser: (id: string) => Effect.Effect<UserRepository, UserError, User>
  createUser: (data: CreateUserData) => Effect.Effect<UserRepository, UserError, User>
}

// Effect-tsのContext/Layerと競合する責務
```

#### ✅ **Effect-ts直接パターン**
```typescript
// シンプル：Serviceのみで十分
interface UserService {
  findById: (id: string) => Effect.Effect<never, DatabaseError, User | null>
  save: (user: User) => Effect.Effect<never, DatabaseError, void>
  getUser: (id: string) => Effect.Effect<never, UserError, User>
  createUser: (data: CreateUserData) => Effect.Effect<never, UserError, User>
}

const UserService = Context.GenericTag<UserService>("UserService")
```

### **Context/Layerの本質的責務**

#### **Contextの役割**
```typescript
// Context = 型安全なグローバル変数キー
const UserService = Context.GenericTag<UserService>("UserService")
// 内部的には Symbol ベースのマップ
// 責務：型情報付きの依存関係識別子
```

#### **Layerの役割**
```typescript
// Layer = context.set() の型安全版
const UserServiceLayer = Layer.succeed(UserService, {
  findById: (id) => Effect.tryPromise({
    try: () => db.users.findUnique({ where: { id } }),
    catch: (error) => new DatabaseError(error)
  }),
  save: (user) => Effect.tryPromise({
    try: () => db.users.upsert({ where: { id: user.id }, update: user, create: user }),
    catch: (error) => new DatabaseError(error)
  })
})
// 責務：実装をContextキーに関連付けるのみ
```

### **推奨アーキテクチャパターン**

#### **ビジネスロジック層**
```typescript
// Service = ビジネスロジック + データアクセス統合
const getUserProfile = (userId: string) =>
  Effect.gen(function* (_) {
    const userService = yield* _(Effect.service(UserService))
    const logger = yield* _(Effect.service(Logger))

    yield* _(logger.info(`Fetching profile for user: ${userId}`))

    const user = yield* _(userService.findById(userId))
    if (!user) {
      return yield* _(Effect.fail(UserErrors.notFound(userId)))
    }

    if (user.deactivatedAt) {
      return yield* _(Effect.fail(UserErrors.deactivated(userId, user.deactivatedAt)))
    }

    return user
  })
```

#### **Layer構成**
```typescript
// アプリケーション全体の依存関係
const AppLayer = Layer.merge(
  DatabaseLayer,      // インフラ
  LoggerLayer,        // インフラ
  UserServiceLayer,   // ビジネスロジック
  EmailServiceLayer   // 外部サービス
)

// テスト用Layer
const TestLayer = Layer.merge(
  MockDatabaseLayer,
  MockLoggerLayer,
  MockUserServiceLayer,
  MockEmailServiceLayer
)
```

### **Effect-ts設計原則**

1. **Service Pattern Only**: Repository抽象化は不要
2. **最小責務**: Context/Layerは薄い責務のみ
3. **型安全DI**: コンパイル時依存関係検証
4. **関数型優先**: クラスより関数とインターフェース
5. **Effect合成**: 小さなEffectから大きなアプリケーション構築
6. **一貫したエコシステム**: 外部ライブラリによる型安全性破壊を避ける
7. **Effect内完結**: エラーハンドリングはEffect.catchTag等で行う

### **絶対に避けるべきアンチパターン**

#### ❌ **ts-pattern等との混在**
- Effect-tsの型安全性を破壊
- Effect.catchTagの存在意義を否定
- `unknown`型への退化を招く

#### ❌ **Effect外でのエラーハンドリング**
- `Effect.runPromise().catch()`は型情報消失
- Effectチェーンの途中でのtry-catch

#### ❌ **any型の使用**
- 型安全性の完全な破綻
- Effect-tsの核心価値を無効化

**Effect-tsを採用する場合は、そのエコシステム内で一貫したパターンを使用し、外部ライブラリによる型安全性の破壊を避けることが最も効率的**

## 🎯 まとめ

Effect-tsにおけるclass-freeエラー設計のベストプラクティス：

### **設計原則**
1. **実装優先**: Factory関数から型を推論、二重記述を排除
2. **ミニマルな例**: 完全にself-containedで動作する実例
3. **型安全性**: TypeScriptの型推論を最大活用、`never`型の積極活用
4. **Zod統合**: 実用的な環境変数バリデーション
5. **依存注入**: Context/Layerによる型安全なDI
6. **並行処理**: Effectの並列実行パターン
7. **エラー集約**: 散乱を避け末尾にまとめる
8. **副作用分離**: 純粋なビジネスロジックと副作用を明確に分離

### **絶対禁止事項**
- **any型の使用**: 型安全性の完全破綻
- **ts-pattern併用**: Effect.catchTagとの二重定義
- **Effect外エラーハンドリング**: 型情報消失を招く
- **Repository Pattern**: Effect-ts環境では不要な抽象化

### **型安全性の核心**
```typescript
// ✅ 完全な型安全性
Effect<Logger & Database, UserError | DatabaseError, User>

// ❌ 型安全性の破綻
Effect<unknown, unknown, unknown> // any と同等
```

**核心原則**: Effect-tsエコシステム内で一貫性を保ち、外部ライブラリによる型安全性破壊を徹底的に避ける。型推論を信頼し、`never`型を活用してより厳密な型制約を実現する。
