# mockdata API移行タスク - 統一データアクセス実現

## 🎯 目標
すべてのmockdataを`@workspace/api`経由で配給し、統一されたデータアクセスパターンを実現

## 📊 現状分析

### 現在の問題点
- **直接インポート**: `@workspace/mockdata`からの静的データ取得
- **分散したデータアクセス**: APIとmockdataの混在
- **将来への対応不足**: リアルAPIへの切り替えが困難

### 移行後の利点
- **統一アクセス**: すべてAPI経由でのデータ取得
- **キャッシュ管理**: react-queryによる効率的なデータ管理
- **状態管理**: ローディング・エラー状態の適切な処理
- **将来対応**: リアルAPIへの容易な切り替え

## 📋 実装計画

### Sprint 1: APIインフラ構築 (60分)
**優先度**: Critical | **工数**: 60分

#### 1.1 packages/api エンドポイント追加
- [ ] **`/api/coins`** - コイン一覧取得
  ```typescript
  app.get('/coins', (c) => {
    const coins = mockCoins;
    return c.json({ success: true, data: coins });
  });
  ```

- [ ] **`/api/coins/:id`** - 特定コイン詳細取得
  ```typescript
  app.get('/coins/:id', (c) => {
    const id = c.req.param('id');
    const coin = mockCoins.find(coin => coin.id === id);
    return c.json({ success: true, data: coin });
  });
  ```

- [ ] **`/api/dominance`** - ドミナンスチャートデータ取得
  ```typescript
  app.get('/dominance', (c) => {
    const data = mockDominanceChartData;
    return c.json({ success: true, data });
  });
  ```

- [ ] **`/api/champions`** - チャンピオンデータ取得
  ```typescript
  app.get('/champions', (c) => {
    const champions = getChampions();
    return c.json({ success: true, data: champions });
  });
  ```

#### 1.2 レスポンス型定義
- [ ] **APIレスポンス型の統一**
  ```typescript
  interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
  }
  ```

- [ ] **エンドポイント別型定義**
  ```typescript
  type CoinsResponse = ApiResponse<CoinCardProps[]>;
  type ChampionsResponse = ApiResponse<Champion[]>;
  type DominanceResponse = ApiResponse<DominanceChartData>;
  ```

### Sprint 2: react-query フック作成 (45分)
**優先度**: High | **工数**: 45分

#### 2.1 基本データフック
- [ ] **useCoins()** - コイン一覧取得
  ```typescript
  export const useCoins = () => {
    return useQuery({
      queryKey: ['coins'],
      queryFn: () => api.coins.$get().then(res => res.json()),
      staleTime: 5 * 60 * 1000, // 5分
    });
  };
  ```

- [ ] **useChampions()** - チャンピオンデータ取得
  ```typescript
  export const useChampions = () => {
    return useQuery({
      queryKey: ['champions'],
      queryFn: () => api.champions.$get().then(res => res.json()),
      staleTime: 10 * 60 * 1000, // 10分
    });
  };
  ```

- [ ] **useDominanceData()** - ドミナンスデータ取得
  ```typescript
  export const useDominanceData = () => {
    return useQuery({
      queryKey: ['dominance'],
      queryFn: () => api.dominance.$get().then(res => res.json()),
      staleTime: 2 * 60 * 1000, // 2分
    });
  };
  ```

#### 2.2 高度なフック
- [ ] **useCoin(id)** - 特定コイン詳細取得
- [ ] **useCoinsWithFilters()** - フィルタリング対応
- [ ] **useOptimisticUpdate()** - 楽観的更新対応

### Sprint 3: コア機能移行 (90分)
**優先度**: High | **工数**: 90分

#### 3.1 主要コンポーネント移行 (60分)
- [ ] **RoundCoinTable.tsx** - テーブル表示の中核
  ```typescript
  // Before
  import { mockCoinMetadata } from "@workspace/mockdata";
  
  // After  
  const { data: coins, isLoading } = useCoins();
  if (isLoading) return <TableSkeleton />;
  ```

- [ ] **Champions.tsx** - チャンピオン表示
  ```typescript
  // Before
  import { getChampions } from "@workspace/mockdata";
  
  // After
  const { data: champions, isLoading } = useChampions();
  if (isLoading) return <ChampionsSkeleton />;
  ```

- [ ] **DominanceRechart.tsx** - チャート表示
  ```typescript
  // Before
  import { mockDominanceChartData } from "@workspace/mockdata";
  
  // After
  const { data: dominanceData, isLoading } = useDominanceData();
  ```

#### 3.2 ローディング・エラー状態実装 (30分)
- [ ] **スケルトンUI作成**
  - TableSkeleton, ChampionsSkeleton, ChartSkeleton
- [ ] **エラーバウンダリ設定**
- [ ] **リトライ機能実装**

### Sprint 4: 全面移行 (120分)
**優先度**: Medium | **工数**: 120分

#### 4.1 ページコンポーネント移行 (60分)
- [ ] **battle/page.tsx** - バトルページ
- [ ] **champions/page.tsx** - チャンピオンページ  
- [ ] **wasabi/* ページ** - Wasabiセクション全般

#### 4.2 UIコンポーネント移行 (45分)
- [ ] **Swap系コンポーネント** - 取引UI群
- [ ] **Chart系コンポーネント** - チャート表示群
- [ ] **Card系コンポーネント** - カード表示群

#### 4.3 詳細ページ対応 (15分)
- [ ] **ChampionDetailPage** - 個別詳細ページ
- [ ] **動的ルーティング対応**

### Sprint 5: クリーンアップ (30分)
**優先度**: Low | **工数**: 30分

#### 5.1 不要インポート削除
- [ ] **全ファイルから`@workspace/mockdata`インポート削除**
- [ ] **未使用関数・型定義の削除**

#### 5.2 最適化
- [ ] **キャッシュ戦略の最適化**
- [ ] **バンドルサイズの確認**
- [ ] **パフォーマンステスト**

## 🔧 技術的実装詳細

### APIエンドポイント設計
```typescript
// packages/api/src/routes/mockdata.ts
export const mockdataRoutes = new Hono()
  .get('/coins', (c) => { /* 実装 */ })
  .get('/coins/:id', (c) => { /* 実装 */ })
  .get('/champions', (c) => { /* 実装 */ })
  .get('/dominance', (c) => { /* 実装 */ });
```

### react-query設定
```typescript
// apps/web/src/hooks/api/index.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});
```

### 型安全性の保証
```typescript
// packages/api/src/types/responses.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp?: number;
}
```

## 📊 進捗指標

### 成功基準
| 指標 | 目標値 | 現状 |
|------|--------|------|
| @workspace/mockdata直接インポート | 0件 | 20+件 |
| API経由データ取得率 | 100% | 20% |
| ローディング状態実装率 | 100% | 0% |
| エラーハンドリング実装率 | 100% | 0% |

### パフォーマンス目標
- **初期ローディング時間**: < 2秒
- **キャッシュヒット率**: > 80%
- **バンドルサイズ増加**: < 10KB

## 🚨 リスク管理

### 高リスク項目
1. **パフォーマンス低下**: API呼び出しによる遅延
   - **軽減策**: 適切なキャッシュ戦略、Prefetching
2. **型安全性の損失**: API境界での型ミスマッチ  
   - **軽減策**: 厳密な型定義、runtime validation
3. **開発体験の悪化**: ローディング状態の複雑化
   - **軽減策**: 統一されたローディングコンポーネント

### 中リスク項目
1. **エラーハンドリングの複雑化**
2. **テストの複雑化**
3. **デバッグの困難化**

## 📝 実装ガイドライン

### コーディング規約
```typescript
// Good: 統一されたAPI呼び出しパターン
const { data: coins, isLoading, error } = useCoins();

// Bad: 直接インポート
import { mockCoins } from "@workspace/mockdata";
```

### エラーハンドリング
```typescript
const { data, isLoading, error } = useCoins();

if (error) {
  return <ErrorMessage error={error} retry={refetch} />;
}

if (isLoading) {
  return <TableSkeleton />;
}
```

### ローディング状態
```typescript
// Suspense境界での処理
<Suspense fallback={<TableSkeleton />}>
  <RoundCoinTable />
</Suspense>
```

## ✅ 完了基準

### Phase 完了条件
- [ ] **Sprint 1**: 全APIエンドポイントが正常動作
- [ ] **Sprint 2**: 全react-queryフックがテスト済み
- [ ] **Sprint 3**: 主要コンポーネントの移行完了
- [ ] **Sprint 4**: 全mockdataインポートの削除
- [ ] **Sprint 5**: パフォーマンス目標達成

### 最終検証項目
- [ ] **機能完全性**: 既存機能の100%互換性
- [ ] **型安全性**: TypeScriptエラー0件
- [ ] **パフォーマンス**: ローディング時間目標達成
- [ ] **エラーハンドリング**: 全エラーケース対応
- [ ] **テスト**: 全APIエンドポイントのテスト完了

---

**実行準備完了** ✅  
**優先度**: Critical - 統一データアクセスはアーキテクチャの根幹  
**開始**: Sprint 1 APIインフラ構築から推奨

**次期展開**: リアルAPIへの切り替え準備完了 🚀