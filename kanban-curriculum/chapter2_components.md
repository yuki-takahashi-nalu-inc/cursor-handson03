# 第2章: Tab補完とCmd+Kでコンポーネント作成

## 学習目標
- Tab補完で高速コーディングを体験
- Cmd+K（インライン編集）で既存コードを改善
- shadcn/uiコンポーネントを活用したリッチなUI作成

## 2.1 Tab補完の基本

### Tab補完とは
- コメントや関数名から自動的にコードを生成
- 複数行のコードを一度に補完
- コンテキストを理解した賢い提案

### ハンズオン課題1: 型定義の作成

1. **`src/types/kanban.ts`を作成**
2. **以下のコメントを入力してTab**：

```typescript
// Define types for kanban board
// Card: id, title, description, status
// Column: id, title, cards array
// Board: columns
```

**Tab補完で生成される型定義の例：**
```typescript
export interface Card {
  id: string
  title: string
  description: string
  status: 'todo' | 'doing' | 'done'
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: string
  title: string
  cards: Card[]
}

export interface Board {
  columns: Column[]
}
```

## 2.2 shadcn/uiコンポーネントの導入

### ハンズオン課題2: UIコンポーネントを追加

**チャット（Cmd+L）で以下を依頼：**

```
shadcn/uiから以下のコンポーネントを追加してください：
- Card（カード表示用）
- Button（操作用）
- Input（入力用）
- Badge（ステータス表示用）

必要なコマンドを実行してインストールしてください。
```

**Cursorが実行するコマンド例：**
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
```

## 2.3 カードコンポーネントの作成

### ハンズオン課題3: Tab補完でカードコンポーネント作成

1. **`src/components/Card/KanbanCard.tsx`を作成**
2. **以下のコメントを入力してTab**：

```tsx
// Create a draggable kanban card component using:
// - shadcn/ui Card component
// - Display title and description
// - Delete button with Trash icon from lucide-react
// - Hover effects with Tailwind
// - TypeScript props interface
```

**生成されるコード例：**
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface KanbanCardProps {
  id: string
  title: string
  description: string
  onDelete: (id: string) => void
}

export function KanbanCard({ id, title, description, onDelete }: KanbanCardProps) {
  return (
    <Card className="mb-2 cursor-move hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
```

## 2.4 Cmd+Kでコードを改善

### ハンズオン課題4: 既存コードの改善

1. **作成したKanbanCardコンポーネントを選択**
2. **Cmd+K（Ctrl+K）を押す**
3. **以下を入力**：

```
このコンポーネントに以下を追加：
- ドラッグハンドルアイコン（GripVertical）
- 優先度バッジ（high/medium/low）
- React.memoで最適化
- ドラッグ中のスタイル変更
```

**Cmd+Kが修正するコード例：**
```tsx
import React, { memo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Trash2 } from 'lucide-react'

interface KanbanCardProps {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  isDragging?: boolean
  onDelete: (id: string) => void
}

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
}

export const KanbanCard = memo(function KanbanCard({ 
  id, 
  title, 
  description, 
  priority,
  isDragging,
  onDelete 
}: KanbanCardProps) {
  return (
    <Card className={`mb-2 cursor-move transition-all ${
      isDragging ? 'opacity-50 rotate-2' : 'hover:shadow-md'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <Badge className={priorityColors[priority]}>
          {priority}
        </Badge>
      </CardContent>
    </Card>
  )
})
```

## 2.5 カラムコンポーネントの作成

### ハンズオン課題5: Tab補完でカラム作成

1. **`src/components/Column/KanbanColumn.tsx`を作成**
2. **コメントを書いてTab補完**：

```tsx
// Create kanban column component with:
// - Title and card count
// - Add card button with Plus icon
// - List of KanbanCard components
// - Scrollable area for cards
// - Drop zone visual feedback
```

## 2.6 新規カード追加フォーム

### ハンズオン課題6: Cmd+Kでフォーム生成

1. **新規ファイル`src/components/AddCardForm.tsx`を作成**
2. **空のファイルでCmd+K**
3. **以下を入力**：

```
shadcn/uiのInput、Button、Selectを使って
カード追加フォームを作成：
- タイトル入力（必須）
- 説明入力
- 優先度選択（high/medium/low）
- 追加ボタンとキャンセルボタン
- Enterキーで送信
```

## 2.7 Boardコンポーネントの更新

### ハンズオン課題7: App.tsxをBoardコンポーネントに変換

1. **`src/components/Board/Board.tsx`を作成**
2. **App.tsxの内容をコピー**
3. **全選択してCmd+K**：

```
このコードを改善：
- 3つのKanbanColumnコンポーネントを使用
- サンプルデータを含むuseState
- カードの追加・削除機能
- レスポンシブデザイン対応
```

## 📝 この章で学んだこと

- ✅ Tab補完による高速コーディング
- ✅ Cmd+Kでの既存コード改善
- ✅ shadcn/uiコンポーネントの活用
- ✅ コメント駆動開発の実践
- ✅ AIを活用した効率的なコンポーネント作成

## 💡 Tab補完のコツ

### 効果的なコメントの書き方

1. **具体的な要件を記述**
```tsx
// Good: Create form with email validation and submit button
// Bad: Make form
```

2. **使用するライブラリを明記**
```tsx
// Use shadcn/ui Card and Button components
```

3. **期待する動作を説明**
```tsx
// Handle drag and drop with visual feedback
```

### Cmd+Kの活用シーン

- **リファクタリング**: 「React.memoで最適化」
- **機能追加**: 「エラーハンドリングを追加」
- **スタイル改善**: 「ダークモード対応」
- **型安全性向上**: 「TypeScript strictモードに対応」

## 🎯 チャレンジ課題

以下の機能をTab補完とCmd+Kで実装してみましょう：

1. カードの編集機能（ダブルクリックで編集モード）
2. カード数の上限設定（Doingは3枚まで）
3. カードの作成日時表示
4. キーボードショートカット（Deleteキーで削除）

## 🚀 次の章へ

第3章では、チャット機能（Cmd+L）を使って、ドラッグ&ドロップなどの複雑なロジックを実装します。

---

### 課題チェックリスト

- [ ] 型定義の作成
- [ ] shadcn/uiコンポーネントの追加
- [ ] KanbanCardコンポーネントの作成
- [ ] KanbanColumnコンポーネントの作成
- [ ] AddCardFormの実装
- [ ] Boardコンポーネントの完成