# apps/web 重複型定義完全除去タスク

## 🎯 目標
apps/web側の重複型定義を完全除去し、packages/typesのみを使用する純粋なmonorepo構造を実現

## 📊 現状分析

### 除去対象の重複types (5つ)
- **影響ファイル総数**: 47ファイル
- **現在のpackages/types依存度**: 60%
- **目標依存度**: 100%

| Type | ファイル | 置き換え先 | 影響範囲 |
|------|----------|------------|----------|
| `ChampionCoin` | champion.ts | `MemeMetadata & MemeMarketData & { round: number }` | 8ファイル |
| `Coin` | coin.ts | `MemeMetadata & MemeMarketData` | 15ファイル |
| `CoinCard` | coincard.ts | `@workspace/mockdata CoinCardProps` | 3ファイル |
| `CoinWithRound` | coin-with-round.ts | `MemeMetadata & MemeMarketData & { round: number; share?: number }` | 21ファイル |
| `LocalCoinCardProps` | coincard.ts | 削除のみ (未使用) | 0ファイル |

### 保持すべきUI固有types ✅
- `ChatMessage` (chat.ts) - チャット機能固有
- `DominancePoint`, `CoinDisplayInfo`, `DominanceChartData` (dominance.ts) - チャート表示固有

## 📋 実装計画

### Phase 1: ChampionCoin置き換え (影響: 8ファイル)
**優先度**: High | **工数**: 30分

#### タスク詳細
- [ ] **型定義作成**: `type ChampionData = MemeMetadata & MemeMarketData & { round: number }`
- [ ] **対象ファイル更新**:
  - `Champions.tsx` - import文変更
  - `ChampionDetailPage.tsx` - 型使用箇所修正
  - `ChampionCoinCard.tsx` - props型更新
  - `ChampionCoinList.tsx` - データ型変更
  - `wasabi/champions/page.tsx` - API型修正
  - その他3ファイル

#### 実装手順
1. 各ファイルで`import type { ChampionCoin }`を削除
2. `import type { MemeMetadata, MemeMarketData } from "@workspace/types"`追加
3. `ChampionCoin`を`MemeMetadata & MemeMarketData & { round: number }`に置き換え
4. `round`プロパティが不要な箇所は除去

### Phase 2: Coin置き換え (影響: 15ファイル)  
**優先度**: High | **工数**: 45分

#### タスク詳細
- [ ] **型定義作成**: `type CoinData = MemeMetadata & MemeMarketData`
- [ ] **対象ファイル更新**:
  - `CoinCard.tsx` - コンポーネントprops型
  - `CoinList.tsx` - リスト表示型
  - `CoinDetailClient.tsx` - 詳細データ型
  - `SwapUI系` - 取引データ型
  - `battle/page.tsx` - バトルロジック型
  - その他10ファイル

#### 実装手順
1. 各ファイルで`import type { Coin }`を削除
2. packages/types基準のimport追加
3. カスタムプロパティ(color, createdBy等)削除
4. UI表示ロジック調整

### Phase 3: CoinCard置き換え (影響: 3ファイル)
**優先度**: Medium | **工数**: 15分

#### タスク詳細
- [ ] **統一**: `@workspace/mockdata`の`CoinCardProps`に完全統一
- [ ] **対象ファイル**:
  - `CoinCard.tsx` - 既に対応済み
  - `CoinList.tsx` - props型変更
  - その他1ファイル

### Phase 4: CoinWithRound置き換え (影響: 21ファイル)
**優先度**: High | **工数**: 60分

#### タスク詳細
- [ ] **型定義作成**: `type RoundCoinData = MemeMetadata & MemeMarketData & { round: number; share?: number }`
- [ ] **対象ファイル更新**:
  - `RoundCoinTable.tsx` - テーブル表示型
  - `SwapUI系` - 取引UI型 (8ファイル)
  - `round系コンポーネント` - ラウンド管理型 (6ファイル)
  - `battle系` - バトル機能型 (4ファイル)
  - その他3ファイル

#### 注意事項
- **最大影響範囲**: 21ファイルで最も慎重な対応が必要
- **段階的実装**: 5ファイル単位で確認しながら進行
- **型互換性**: `share`プロパティの optional化確認

### Phase 5: ファイル削除とクリーンアップ
**優先度**: Low | **工数**: 10分

#### タスク詳細
- [ ] **ファイル削除**:
  ```bash
  rip apps/web/src/types/champion.ts
  rip apps/web/src/types/coin.ts  
  rip apps/web/src/types/coincard.ts
  rip apps/web/src/types/coin-with-round.ts
  ```
- [ ] **index.ts更新**: export文からの削除
- [ ] **最終確認**: 47ファイル全てでエラーなし

## 🚀 実行戦略

### Sprint 1: 軽量型から開始 (90分)
1. **CoinCard置き換え** (15分) - 影響最小
2. **ChampionCoin置き換え** (30分) - 単純置き換え
3. **Coin置き換え** (45分) - 中規模影響

### Sprint 2: 大規模型対応 (70分)  
1. **CoinWithRound置き換え** (60分) - 最大影響
2. **ファイル削除** (10分) - 最終クリーンアップ

### 各Phase完了後の確認事項
- [ ] `bun run typecheck` - TypeScript型チェック
- [ ] `bun run check` - biome lint  
- [ ] 対象ファイルでのエラー0件確認

## ✅ 完了基準

### アーキテクチャ成果指標

| 指標 | Before | After | 達成度 |
|------|--------|-------|--------|
| apps/web重複型定義 | 5個 | 0個 | ✅ |
| packages/types依存度 | 60% | 100% | ✅ |
| UI固有型のみ残存 | ❌ | ✅ | ✅ |
| monorepo原則準拠 | ❌ | ✅ | ✅ |

### 技術的完了条件
- [ ] 47ファイル全てでTypeScriptエラー0件
- [ ] apps/web/src/types/に残るのは`chat.ts`, `dominance.ts`, `index.ts`のみ
- [ ] 全コンポーネントがpackages/types基準で動作
- [ ] 重複型定義完全除去達成

## 🔧 実装ガイドライン

### 型置き換えパターン
```typescript
// Before (重複型)
import type { ChampionCoin } from "@/types/champion";

// After (canonical型)
import type { MemeMetadata, MemeMarketData } from "@workspace/types";
type ChampionData = MemeMetadata & MemeMarketData & { round: number };
```

### import更新パターン
```typescript
// Before
import type { Coin, ChampionCoin, CoinWithRound } from "@/types";

// After  
import type { MemeMetadata, MemeMarketData } from "@workspace/types";
```

## 📝 注意事項

### 実装時の必須チェック
- **型安全性**: 各Phase完了後TypeScriptエラー0件確認
- **UI互換性**: 既存コンポーネント表示の不変確認  
- **段階的実装**: 5ファイル単位での逐次確認
- **packages/types優先**: 常にcanonical型を基準とする

### リスク管理
- **最大リスク**: CoinWithRound (21ファイル影響)
- **軽減策**: 段階的実装とPhase毎の動作確認
- **回避策**: 問題発生時は前Phaseに戻って再実装

---

**実行準備完了** ✅  
**優先度**: Critical - packages/typesへの完全移行はmonorepo構造の根幹  
**開始**: Phase 1 CoinCard置き換えから推奨