# コインカードコンポーネント統合タスク - UI一貫性とメンテナンス性向上

## 🎯 目標
散在するコインカードコンポーネント（5つ）を統合し、UI一貫性とメンテナンス性を向上

## 📊 現状分析

### 現在の問題点
- **重複コンポーネント**: 5つのコインカードが散在
  - CoinCard (基本リスト表示)
  - ChampionCoinCard (チャンピオン専用)  
  - CoinDetailCard (詳細表示・ソーシャルリンク付き)
  - BattleCoinDetailCard (バトル画面専用)
  - SwapRoundCoinCard (取引機能付き)

- **型定義の散在**: 各コンポーネントで個別の型定義
- **共通ロジック重複**: 画像表示、フォーマット処理、coinId生成の重複
- **保守性の問題**: 変更時の影響範囲が不明確

### 統合戦略
**統合対象**: CoinCard + ChampionCoinCard → UnifiedDisplayCard
**独立維持**: BattleCoinDetailCard, SwapRoundCoinCard (機能特化のため)

## 📋 実装計画

### Sprint 1: 基盤整備 (30分・低リスク)
**優先度**: Critical | **工数**: 30分

#### 1.1 共通型定義統合 (10分)
- [ ] **BaseCoinDisplayProps作成** - apps/web/src/types/coin.ts
  ```typescript
  interface BaseCoinDisplayProps extends UIMemeMetadata {
    variant?: "list" | "champion";
    showRound?: boolean;
    showFavorite?: boolean;
    onToggleFavorite?: (address: string) => void;
    className?: string;
  }
  ```

#### 1.2 共通ユーティリティ抽出 (10分)
- [ ] **coinUtils.ts作成** - apps/web/src/utils/coinUtils.ts
  ```typescript
  export const generateCoinId = (coin: UIMemeMetadata): string => {...}
  export const formatCoinDisplayData = (coin: UIMemeMetadata): DisplayData => {...}
  export const getCoinCardClasses = (variant: string): string => {...}
  ```

#### 1.3 共通画像コンポーネント (10分)
- [ ] **CoinImage.tsx作成** - apps/web/src/components/coins/CoinImage.tsx
  ```typescript
  interface CoinImageProps {
    src: string;
    alt: string;
    size?: "sm" | "md" | "lg";
    className?: string;
  }
  ```

### Sprint 2: 統合コンポーネント作成 (45分・中リスク)
**優先度**: High | **工数**: 45分

#### 2.1 UnifiedDisplayCard設計 (15分)
- [ ] **統合コンポーネント作成** - apps/web/src/components/coins/UnifiedDisplayCard.tsx
  ```typescript
  export const UnifiedDisplayCard = ({ 
    variant = "list", 
    data, 
    showRound = false,
    ...props 
  }: BaseCoinDisplayProps) => {
    return match(variant)
      .with("list", () => <ListLayout data={data} {...props} />)
      .with("champion", () => <ChampionLayout data={data} {...props} />)
      .exhaustive();
  };
  ```

#### 2.2 レイアウトコンポーネント実装 (20分)
- [ ] **ListLayout実装** - CoinCardのレイアウト継承
- [ ] **ChampionLayout実装** - ChampionCoinCardのレイアウト継承
- [ ] **ts-pattern使用** - 条件分岐の型安全化

#### 2.3 プロパティマッピング (10分)
- [ ] **mapCoinCardProps関数** - 既存props変換
- [ ] **mapChampionCardProps関数** - 既存props変換

### Sprint 3: 段階的移行 (30分・低リスク)
**優先度**: High | **工数**: 30分

#### 3.1 CoinCard移行 (10分)
- [ ] **CoinCard.tsx更新** - UnifiedDisplayCardラッパー化
  ```typescript
  export const CoinCard = (props: CoinCardProps) => {
    return <UnifiedDisplayCard {...mapCoinCardProps(props)} />;
  };
  ```

#### 3.2 ChampionCoinCard移行 (10分)
- [ ] **ChampionCoinCard.tsx更新** - UnifiedDisplayCardラッパー化
- [ ] **型安全性確認** - TypeScriptエラーチェック

#### 3.3 動作確認・最適化 (10分)
- [ ] **UI表示確認** - 既存機能の完全互換性
- [ ] **旧実装削除** - 重複コードの除去
- [ ] **インポート更新** - 依存関係の整理

### Sprint 4: 最適化・独立コンポーネント改善 (15分・任意)
**優先度**: Medium | **工数**: 15分

#### 4.1 独立コンポーネント最適化
- [ ] **BattleCoinDetailCard改善** - 共通要素の活用
- [ ] **SwapRoundCoinCard改善** - 共通要素の活用
- [ ] **共通コンポーネント活用** - CoinImage, coinUtilsの使用

## 🔧 技術的実装詳細

### 統合アーキテクチャ
```typescript
// 統合前: 5つの個別コンポーネント
CoinCard, ChampionCoinCard, CoinDetailCard, BattleCoinDetailCard, SwapRoundCoinCard

// 統合後: 3つのコンポーネント + 共通基盤
UnifiedDisplayCard (CoinCard + ChampionCoinCard統合)
+ 独立: BattleCoinDetailCard, SwapRoundCoinCard
+ 共通: CoinImage, coinUtils, BaseCoinDisplayProps
```

### 型安全性の保証
```typescript
// ts-pattern使用による条件分岐の型安全化
const Layout = match(variant)
  .with("list", () => <ListLayout />)
  .with("champion", () => <ChampionLayout />)
  .exhaustive(); // 漏れチェック
```

### レスポンシブ対応
```typescript
// 既存のレスポンシブ機能を維持
className={`${baseClasses} ${variantClasses[variant]} ${className}`}
```

## 📊 進捗指標

### 成功基準
| 指標 | 目標値 | 現状 |
|------|--------|------|
| コンポーネント数 | 3つ | 5つ |
| 型定義統一率 | 100% | 20% |
| 重複コード削減 | 70% | 0% |
| TypeScriptエラー | 0件 | TBD |

### パフォーマンス目標
- **バンドルサイズ**: 変更なし (統合による増加回避)
- **レンダリング速度**: 変更なし (既存パフォーマンス維持)
- **開発効率**: 新機能追加時間50%短縮

## 🚨 リスク管理

### 高リスク項目
1. **UI互換性**: 既存レイアウトの完全再現
   - **軽減策**: 段階的移行、詳細な視覚テスト
2. **型安全性**: 複雑なプロパティマッピング
   - **軽減策**: TypeScript strict mode、包括的テスト

### 中リスク項目
1. **パフォーマンス影響**: 統合による複雑化
2. **開発体験**: 新しいAPI学習コスト

## 📝 実装ガイドライン

### コーディング規約
```typescript
// Good: 統一されたVariant使用
<UnifiedDisplayCard variant="list" data={coinData} />

// Bad: 直接的な条件分岐
{isChampion ? <ChampionCard /> : <CoinCard />}
```

### テスト戦略
```typescript
// 各variantのテスト
describe('UnifiedDisplayCard', () => {
  it('renders list variant correctly', () => {...});
  it('renders champion variant correctly', () => {...});
});
```

## ✅ 完了基準

### Sprint 完了条件
- [ ] **Sprint 1**: 共通基盤が正常動作
- [ ] **Sprint 2**: UnifiedDisplayCardが全variant対応
- [ ] **Sprint 3**: 既存コンポーネントの完全置換
- [ ] **Sprint 4**: パフォーマンス目標達成

### 最終検証項目
- [ ] **機能完全性**: 既存機能の100%互換性
- [ ] **型安全性**: TypeScriptエラー0件
- [ ] **UI一貫性**: デザインシステム準拠
- [ ] **パフォーマンス**: 既存レベル維持
- [ ] **保守性**: コード重複70%削減達成

## 📈 期待効果

### 短期効果
- **ファイル数削減**: 5つ → 3つ (40%削減)
- **型定義統一**: 散在した型の一元化
- **重複コード除去**: 保守性の大幅向上

### 長期効果
- **開発効率向上**: 新機能追加時間50%短縮
- **UI一貫性**: ブランド体験の統一
- **技術負債削減**: 将来の拡張性確保

---

**実行準備完了** ✅  
**優先度**: High - UI基盤の統一は開発効率に直結  
**開始**: Sprint 1 基盤整備から推奨

**次期展開**: デザインシステム化への基盤構築完了 🚀