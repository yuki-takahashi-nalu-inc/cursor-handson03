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
確認メッセージを表示して
```

### ハンズオン課題2: タイトルのスタイル改善

**1. TaskCardコンポーネントのタイトル部分を選択**
```tsx
// src/components/TaskCard.tsx のCardTitle部分を選択
<CardTitle>{task.title}</CardTitle>
```

**2. 選択してCmd+K：**
```
文字を少し大きくして、優先度に応じて色を変えて
```

### ハンズオン課題3: 完了タスクのスタイル変更

**1. TaskCardのカード部分を選択**
```tsx
// src/components/TaskCard.tsx のCard部分を選択
<Card className="mb-2">
  {/* カード内容 */}
</Card>
```

**2. 選択してCmd+K：**
```
statusがdoneの時、カード全体を少し薄くして完了感を出して
```

## 3.3 Tab補完で効率的にコードを生成

### ハンズオン課題4: 既存の関数にコメントをTab補完で追加

**既存のコンポーネントや関数にJSDocコメントを追加：**

1. 任意のコンポーネントファイル（例：`src/components/TaskCard.tsx`や`src/App.tsx`）を開く
2. ファイル内の関数を探す（例：コンポーネント関数、イベントハンドラ等）
3. その関数の直前に `/**` と入力してEnterキーを押し、Tabキーで補完：

```typescript
// 例：既存の関数の上に以下を入力
/**
// ここでTabキーを押すとコメントが自動生成される

function handleDelete(id: string) {
  // 既存の処理
}
```

Tab補完が関数の内容を解析して、以下のようなコメントを生成：
```typescript
/**
 * タスクを削除する
 * @param id - 削除するタスクのID
 */
function handleDelete(id: string) {
  // 既存の処理
}
```

**ポイント：**
- `/**` と入力するとJSDoc形式のコメントが始まる
- Tabキーで関数の内容に応じたコメントを自動生成
- 関数名、パラメータ、処理内容から適切な説明を推測

### ハンズオン課題5: コメントから関数を生成

**コメントを書いてから、そのコメントに基づいて関数を生成：**

1. 使用中のコンポーネントファイル（例：`src/components/TaskCard.tsx`）を開く
2. コンポーネントの外側（import文の後）に以下のコメントを書いて、その下でTabキーを押して関数を生成：

```typescript
/**
 * タスクの優先度に基づいて色を返す関数
 * @param priority - タスクの優先度 (high, medium, low)
 * @returns Tailwind CSSのカラークラス名
 */
function getPriorityColor
// ここでTabキーを押す
```

Tab補完が以下のような関数を生成：
```typescript
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'low':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}
```

### ハンズオン課題6: 日付フォーマット関数を生成

**日付関連のユーティリティ関数をコメントから生成：**

1. 既存のコンポーネントファイル内（import文の後）に追加
2. 以下のコメントを書いてTabキーで補完：

```typescript
/**
 * 日付を日本語の相対表現で返す
 * 例: "今日", "明日", "3日後"
 * @param date - 対象の日付
 * @returns 日本語の相対日付表現
 */
function getRelativeDateString
// ここでTabキーを押す
```

**このハンズオンでの注意：** Tab補完の練習のため、上記の例では`export`を付けていません。実際のプロジェクトでは必要に応じて`export`を使い分けてください。

## 3.4 実践的な改善例

### ハンズオン課題7: 優先度バッジの色分け

**TaskCardの優先度表示部分を選択してCmd+K：**

```
優先度によって色を変更：high=赤、medium=黄、low=緑
```

### ハンズオン課題8: タスクカウント表示の追加

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

1. **明確な日本語コメント**
```typescript
// タスクのステータスによってアイコンを返す関数
// todo: 時計アイコン、doing: 実行中アイコン、done: チェックマーク
```

2. **JSDocコメントから関数を生成**
```typescript
/**
 * タスクの期限までの残り日数を計算
 * @param dueDate - 期限日
 * @returns 残り日数（過ぎている場合は負の値）
 */
function getDaysUntilDue
// ここでTabキーを押す
```

3. **型定義からの補完**
```typescript
interface TaskFilter {
  status?: string
  priority?: string
  assignee?: string
}

// フィルター条件に基づいてタスクを絞り込む
function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  // ここでTabキーを押す
}
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

- [ ] 削除ボタンに確認ダイアログを追加（Cmd+K）
- [ ] タイトルのスタイル改善（Cmd+K）
- [ ] 完了タスクのスタイル変更（Cmd+K）
- [ ] 関数のコメントをTab補完で追加
- [ ] コメントから関数を生成（Tab補完）
- [ ] 日付フォーマット関数を生成（Tab補完）
- [ ] 優先度バッジの色分け（Cmd+K）
- [ ] タスクカウント表示（Cmd+K）