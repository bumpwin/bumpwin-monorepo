# OUR_TASK - tempMockData.ts 削除タスク

## 🎯 概要
`apps/web/src/lib/tempMockData.ts` の完全削除を通じて、packages/mockdata への単一依存を実現する

## 📊 現状分析
- **重複データ管理**: tempMockData.ts と packages/mockdata
- **16ファイル依存**: 直接インポートがWebアプリ全体に散在
- **カスタムロジック**: 色マッピング、チャートデータ生成、型定義

## 📋 タスク一覧

### 🚀 Phase 1: packages/mockdata 機能拡張 (High Priority)
**目標**: tempMockData.ts のカスタムロジックを packages/mockdata に移行

#### 1.1 色マッピング機能追加
- **現状**: tempMockData.ts にハードコード
  ```typescript
  color: ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"][index] || "#FF69B4"
  ```
- **目標**: packages/mockdata に `getMemeWithColor()` 関数追加
- **作業内容**:
  ```typescript
  // packages/mockdata/src/colors.ts 新規作成
  export const CHART_COLORS = ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"];
  export const getMemeWithColor = (meme: MemeMetadata, index: number) => ({
    ...meme,
    color: CHART_COLORS[index % CHART_COLORS.length]
  });
  ```
- **工数**: 20分

#### 1.2 チャートデータ生成機能追加
- **現状**: tempMockData.ts に144ポイント生成ロジック
- **目標**: packages/mockdata に `generateDominanceChartData()` 追加
- **作業内容**:
  ```typescript
  // packages/mockdata/src/chartData.ts 新規作成
  export const generateDominanceChartData = (points = 144) =>
    Array.from({ length: points }, (_, i) => ({
      timestamp: i * 10,
      shares: Array.from({ length: 4 }, () => 15 + Math.random() * 20),
    }));
  ```
- **工数**: 15分

#### 1.3 CoinCard 生成機能追加
- **現状**: tempMockData.ts で mockmemes → CoinCardProps 変換
- **目標**: packages/mockdata に `getCoinCards()` 関数追加
- **作業内容**:
  ```typescript
  // packages/mockdata/src/coinCards.ts 新規作成
  export const getCoinCards = (limit = 6): CoinCardProps[] =>
    mockmemes.slice(0, limit).map((meme, index) => ({
      // 変換ロジック
    }));
  ```
- **工数**: 25分

### 🔧 Phase 2: 型定義移行 (Medium Priority)
**目標**: カスタム型定義を適切な場所に移行

#### 2.1 CoinDetailData 型を packages/types に移行
- **現状**: tempMockData.ts 内に定義
- **目標**: packages/types/src/coin.ts に統合
- **作業内容**:
  ```typescript
  // packages/types/src/coin.ts に追加
  export interface CoinDetailData {
    address: string;
    symbol: string;
    // ... 既存の型定義
  }
  ```
- **工数**: 15分

#### 2.2 インポートパス更新
- **現状**: `import { CoinDetailData } from "@/lib/tempMockData"`
- **目標**: `import { CoinDetailData } from "@workspace/types"`
- **影響ファイル**: CoinDetailClient.tsx, SwapPanel.tsx
- **工数**: 10分

### 📱 Phase 3: インポート置換 (High Priority)
**目標**: 16ファイルの tempMockData インポートを packages/mockdata に置換

#### 3.1 簡単な置換 (60% - 即座可能)
**対象ファイル**: 10ファイル
- **置換内容**:
  ```typescript
  // Before
  import { mockCoins } from "@/lib/tempMockData";
  import { mockChampionCoinMetadata } from "@/lib/tempMockData";

  // After
  import { getCoinCards, getChampions } from "@workspace/mockdata";
  ```
- **工数**: 30分

#### 3.2 色マッピング置換 (30% - カスタムロジック)
**対象ファイル**: 6ファイル
- **置換内容**:
  ```typescript
  // Before
  import { mockCoinMetadata } from "@/lib/tempMockData";

  // After
  import { getMemeWithColor, mockmemes } from "@workspace/mockdata";
  const mockCoinMetadata = mockmemes.slice(0, 4).map(getMemeWithColor);
  ```
- **工数**: 25分

#### 3.3 チャートデータ置換 (30% - カスタムロジック)
**対象ファイル**: 6ファイル
- **置換内容**:
  ```typescript
  // Before
  import { mockDominanceChartData } from "@/lib/tempMockData";

  // After
  import { generateDominanceChartData } from "@workspace/mockdata";
  const mockDominanceChartData = generateDominanceChartData();
  ```
- **工数**: 25分

### 🗑️ Phase 4: tempMockData.ts 削除 (Low Priority)
**目標**: 完全削除とビルド確認

#### 4.1 ファイル削除
- **作業内容**: `rm apps/web/src/lib/tempMockData.ts`
- **工数**: 1分

#### 4.2 ビルド・型チェック確認
- **作業内容**: `pnpm build && pnpm typecheck`
- **工数**: 5分

## 🎯 実装優先順位

### Sprint 1 (1時間30分)
1. packages/mockdata 機能拡張 (60分)
   - 色マッピング (20分)
   - チャートデータ生成 (15分)
   - CoinCard生成 (25分)
2. 型定義移行 (25分)
3. 簡単なインポート置換 (30分)

### Sprint 2 (50分)
1. 色マッピング置換 (25分)
2. チャートデータ置換 (25分)

### Sprint 3 (10分)
1. tempMockData.ts 削除 (1分)
2. ビルド確認 (5分)
3. 最終検証 (4分)

## ✅ 完了基準

### Phase 1-2
- [ ] packages/mockdata に全機能追加完了
- [ ] packages/types に型定義移行完了
- [ ] TypeScriptエラー0件維持

### Phase 3
- [ ] 全16ファイルでtempMockDataインポート削除
- [ ] packages/mockdata のみの依存に統合
- [ ] 既存機能の動作確認

### Phase 4
- [ ] tempMockData.ts完全削除
- [ ] `pnpm build` 成功
- [ ] 全機能正常動作

## 📊 影響分析

### 削除によるメリット
- **単一依存**: packages/mockdata のみ
- **重複排除**: データ管理の一元化
- **保守性向上**: 変更箇所の明確化

### リスク
- **型安全性**: 型定義移行時の整合性
- **機能互換**: カスタムロジックの完全移行

## 📝 注意事項

- **段階的実装**: 各Phase完了後にビルド確認
- **型安全性**: TypeScriptエラー0件維持必須
- **機能保証**: 既存UIの動作不変
- **Git**: Phase毎コミット推奨

## 🤝 次のステップ

1. **Phase選択**: Sprint 1から開始推奨
2. **実装**: packages/mockdata機能拡張から
3. **検証**: 各段階でビルド・動作確認
4. **完了**: tempMockData.ts完全削除

---
*最終更新: 2025-01-06*
*作成者: Claude Code*
*対象: tempMockData.ts 削除による依存関係整理*
