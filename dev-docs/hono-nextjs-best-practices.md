# Hono + Next.js App Router 実装ガイド

## 概要
このドキュメントは、Hono と Next.js App Router を組み合わせて使用する際の実践的な知識と、実装時に遭遇した問題とその解決方法をまとめたものです。

## 重要な学習ポイント

### 1. Next.js App Router の `[[...route]]` パターンの動作

**問題点:**
- Next.js App Router で `/app/api/[[...route]]/route.ts` を使用すると、`/api/*` へのリクエストがすべてこのハンドラーに渡される
- **重要**: Next.js は `/api` プレフィックスを**削除しない**。つまり、Hono には `/api/health` のようなフルパスが渡される

**誤った理解:**
```typescript
// ❌ 間違い: Next.js が /api を削除すると思い込んでいた
const app = new Hono()
  .get("/health", handler)  // /health では動作しない
```

**正しい実装:**
```typescript
// ✅ 正解: /api プレフィックスを含めてルーティング
const apiApp = new Hono().route("/api", app);
export const GET = handle(apiApp);
```

### 2. Hono の型推論メカニズム

**問題点:**
- Hono の RPC クライアント (`hc`) は、サーバー側のルート定義から型を推論する
- **メソッドチェーンが必須**: ルート定義を分割すると型推論が壊れる

**誤った実装:**
```typescript
// ❌ 間違い: 型推論が失われる
const api = new Hono();
api.get("/users", handler);  // チェーンが切れている
```

**正しい実装:**
```typescript
// ✅ 正解: メソッドチェーンで型を保持
const api = new Hono()
  .get("/users", handler)
  .post("/users", handler);
```

### 3. monorepo での TypeScript 設定

**必要な設定:**

1. **API パッケージの tsconfig.json:**
```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "noEmit": false,
    "emitDeclarationOnly": true
  }
}
```

2. **Web アプリの tsconfig.json:**
```json
{
  "references": [
    { "path": "../../packages/api" }
  ]
}
```

### 4. hono/client の正しい使い方

**重要なポイント:**
- `hc` クライアントは完全な URL を必要とする
- サーバーサイドとクライアントサイドで異なる URL を使用する必要がある

```typescript
// apps/web/src/app/client.ts
const baseUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:3000/api";

export const api = hc<AppType>(baseUrl);
```

## 遭遇した問題と解決方法

### 問題 1: API が常に 404 を返す

**原因:** 
- Next.js が `/api` プレフィックスを保持したまま Hono に渡していた
- Hono は `/health` を期待していたが、実際には `/api/health` が渡されていた

**解決方法:**
```typescript
// route.ts で /api プレフィックスを含めてマウント
const apiApp = new Hono().route("/api", app);
```

### 問題 2: TypeScript の型エラー "Property 'battlerounds' does not exist"

**原因:**
- 型宣言ファイル (.d.ts) が生成されていなかった
- tsconfig.json で `noEmit: true` が設定されていた

**解決方法:**
- API パッケージで `composite: true` と `emitDeclarationOnly: true` を設定
- `pnpm tsc --build` で型宣言ファイルを生成

### 問題 3: basePath オプションが認識されない

**原因:**
- 古い Hono のドキュメントを参照していた
- `new Hono({ basePath: "/api" })` は現在のバージョンでは使用できない

**解決方法:**
- `.route()` メソッドを使用してベースパスを設定

## ベストプラクティス

### 1. API の構造化

```typescript
// packages/api/src/app.ts
export const app = new Hono()
  .route("/users", usersApi)
  .route("/posts", postsApi)
  .get("/health", (c) => c.json({ status: "ok" }));

export type AppType = typeof app;
```

### 2. エラーハンドリング

```typescript
// neverthrow を使用した型安全なエラーハンドリング
import { err, ok } from "neverthrow";

const handler = async (c) => {
  const result = await someOperation();
  return result.match(
    (data) => c.json(data),
    (error) => c.json({ error: error.message }, 500)
  );
};
```

### 3. デバッグ方法

```typescript
// リクエストパスを確認するミドルウェア
app.use("*", async (c, next) => {
  console.log("Request path:", c.req.path);
  console.log("Request URL:", c.req.url);
  return next();
});
```

## チェックリスト

実装時に確認すべきポイント：

- [ ] TypeScript の `strict: true` が有効になっているか
- [ ] API パッケージで型宣言ファイルが生成されているか
- [ ] Web アプリの tsconfig.json に references が設定されているか
- [ ] Hono のルート定義がメソッドチェーンで書かれているか
- [ ] Next.js の route handler で正しくパスがマウントされているか
- [ ] クライアント側で正しいベース URL を使用しているか

## まとめ

Hono + Next.js App Router の組み合わせは強力ですが、以下の点に注意が必要です：

1. **パスの扱い**: Next.js は `/api` プレフィックスを削除しない
2. **型推論**: メソッドチェーンを維持することが重要
3. **monorepo 設定**: TypeScript の project references が必須
4. **デバッグ**: リクエストパスをログ出力して確認することが重要

これらの点を理解していれば、型安全で高性能な API を構築できます。