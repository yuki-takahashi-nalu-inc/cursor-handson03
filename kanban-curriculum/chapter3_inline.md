# 第3章: Cmd+Kで細部を洗練させる

## 学習目標
- Cmd+K（インライン編集）でAIと協働してコードを改善
- Tab補完でAIにコードを生成してもらう
- AIとの細かい調整とリファクタリングを体験
- AIペアプログラミングでコード品質を向上させる方法を学ぶ

## 3.1 Cmd+KとTab補完の基本

### インライン編集の特徴
- **Cmd+K（Ctrl+K）**: 選択した範囲を直接AI編集
- **Tab補完**: コメントや関数名から自動補完
- **メリット**: ピンポイントな修正、素早い改善

### 使い分けのコツ
| ツール | 用途 | 適した場面 |
|--------|------|------------|
| **Agent（Cmd+I）** | 複雑な実装全般 | 新機能追加、複数ファイル編集 |
| **Cmd+K** | 局所的な改善 | リファクタリング、バグ修正 |
| **Tab補完** | 新規コード生成 | 関数作成、定型処理 |

## 3.2 Cmd+Kで細かい改善を体験

### ハンズオン課題1: ボタンのスタイル改善

**1. TaskCardコンポーネントの削除ボタン部分を選択**
```tsx
// src/components/TaskCard.tsx の削除ボタン部分を選択
<Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
  <Trash2 className="h-4 w-4" />
</Button>
```

**2. 選択してCmd+K：**
```
削除ボタンに確認ダイアログを追加して、赤色のホバー効果も追加
```

### ハンズオン課題2: エラーメッセージの改善

**1. TaskDialogのバリデーション部分を選択**
```tsx
// src/components/TaskDialog.tsx のエラー表示部分を選択
if (!title.trim()) {
  return
}
```

**2. 選択してCmd+K：**
```
タイトルが空の時にtoastでエラーメッセージを表示
```

### ハンズオン課題3: 検索機能の最適化

**1. SearchBarコンポーネントの検索処理を選択**
```tsx
// src/components/SearchBar.tsx の onChange 部分を選択
onChange={(e) => setSearchTerm(e.target.value)}
```

**2. 選択してCmd+K：**
```
debounceを使って300ms遅延で検索を実行するように改善
```

### ハンズオン課題4: アニメーションの追加

**1. TaskCardのカード部分を選択**
```tsx
// src/components/TaskCard.tsx のCard部分を選択
<Card className="mb-2">
  {/* カード内容 */}
</Card>
```

**2. 選択してCmd+K：**
```
ホバー時にカードが少し浮き上がるアニメーション（scale: 1.02, shadow変化）を追加
```

## 3.3 Tab補完で効率的にコードを生成

### ハンズオン課題5: ユーティリティ関数の作成

**新規ファイル作成してTab補完を活用：**

1. `src/utils/taskHelpers.ts`を作成
2. コメントを書いてTabキーで補完：

```typescript
// Function to calculate task completion percentage
// Input: array of tasks
// Output: percentage as number (0-100)
export function calculateCompletionRate
// ここでTabキーを押す
```

Tab補完が以下のような実装を生成：
```typescript
export function calculateCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.status === 'done')
  return Math.round((completedTasks.length / tasks.length) * 100)
}
```

### ハンズオン課題6: 日付フォーマット関数の作成

**Tab補完で日付処理を実装：**

```typescript
// Function to format date to relative time (e.g., "2 hours ago", "yesterday")
// Uses date-fns formatDistanceToNow
export function formatRelativeTime
// Tabキーで補完
```

### ハンズオン課題7: バリデーション関数の作成

```typescript
// Function to validate task title (min 3 chars, max 50 chars)
// Returns { isValid: boolean, error?: string }
export function validateTaskTitle
// Tabキーで補完
```

## 3.4 実践的な改善例

### ハンズオン課題8: 優先度バッジの色分け

**TaskCardの優先度表示部分を選択してCmd+K：**

```
優先度によって色を変更：high=赤、medium=黄、low=緑
```

### ハンズオン課題9: タスクカウント表示の追加

**Columnコンポーネントのヘッダー部分を選択してCmd+K：**

```
タスク数をヘッダーに表示（例：To Do (3)）
```

## 3.5 よく使うCmd+Kのパターン

### パターン1: スタイルの微調整
```
選択部分のpaddingを増やしてボーダーを丸くする
```

### パターン2: 条件分岐の追加
```
タスクが0件の時は「タスクがありません」と表示
```

### パターン3: ローディング状態の追加
```
データ取得中はスケルトンローダーを表示
```

### パターン4: ツールチップの追加
```
アイコンにホバーした時に説明文を表示
```

## 📝 この章でAIと協働して実現したこと

- ✅ Cmd+KでAIにピンポイントな改善を依頼
- ✅ Tab補完でAIにコードを生成してもらう
- ✅ AIを活用したパフォーマンス最適化
- ✅ AIと協働してアクセシビリティを実装
- ✅ AIペアプログラミングでコード品質を向上

## 💡 Cmd+K活用のベストプラクティス

### 効果的な使い方

1. **具体的な指示**
```
❌ 「改善して」
✅ 「React.memoで最適化し、不要な再レンダリングを防ぐ」
```

2. **段階的な改善**
```
1. まず動作する実装
2. Cmd+Kで最適化
3. Cmd+Kでエラー処理追加
4. Cmd+Kでアクセシビリティ改善
```

3. **適切な範囲選択**
```
- 関数単位で選択
- 意味のあるブロック単位
- 依存関係を考慮
```

### Tab補完のコツ

1. **明確なコメント**
```typescript
// Create memoized selector for filtering cards by status and priority
// with proper TypeScript types and error handling
```

2. **関数シグネチャから開始**
```typescript
function validateCard(card: Partial<Card>): ValidationResult {
  // Tab here
}
```

3. **期待する実装を示唆**
```typescript
// Implement debounced search with 300ms delay using lodash
```

## 🎯 チャレンジ課題

Cmd+KとTab補完で以下を改善：

1. **パフォーマンス監視**
   - React DevToolsでレンダリング確認
   - ボトルネックをCmd+Kで改善

2. **コードメトリクス改善**
   - 循環的複雑度の削減
   - 関数の行数削減

3. **デザインパターン適用**
   - Observerパターン
   - Factoryパターン

## 🚀 次の章へ

第4章では、AIコードレビュー機能でAIにコード品質をチェックしてもらいます。

---

### 課題チェックリスト

- [ ] 削除ボタンに確認ダイアログを追加
- [ ] エラーメッセージのtoast表示
- [ ] 検索のdebounce処理
- [ ] ホバーアニメーション追加
- [ ] Tab補完でユーティリティ関数作成
- [ ] 優先度バッジの色分け
- [ ] タスクカウント表示