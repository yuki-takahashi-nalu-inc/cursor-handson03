# 第3章: Cmd+Kで細部を洗練させる

## 学習目標
- Cmd+K（インライン編集）で既存コードを改善
- Tab補完でコードを素早く生成
- 細かい調整とリファクタリングの技術を習得
- コードの品質向上テクニックを学ぶ

## 3.1 Cmd+KとTab補完の基本

### インライン編集の特徴
- **Cmd+K（Ctrl+K）**: 選択した範囲を直接AI編集
- **Tab補完**: コメントや関数名から自動補完
- **メリット**: ピンポイントな修正、素早い改善

### 使い分けのコツ
| ツール | 用途 | 適した場面 |
|--------|------|------------|
| **Agent（Cmd+I）** | 大規模な変更 | 新機能追加、複数ファイル編集 |
| **Cmd+K** | 局所的な改善 | リファクタリング、バグ修正 |
| **Tab補完** | 新規コード生成 | 関数作成、定型処理 |

## 3.2 コンポーネントの最適化

### ハンズオン課題1: KanbanCardの改善

**1. `src/components/Card/KanbanCard.tsx`を開く**
**2. コンポーネント全体を選択してCmd+K：**

```
このコンポーネントを改善：
- React.memoで最適化
- 優先度によるカラー分け（high=赤、medium=黄、low=緑）
- ホバー時のツールチップ追加（作成日時表示）
- ダブルクリックで編集モード切り替え
- アニメーションの追加（spring効果）
```

**Cmd+Kが生成する改善例：**
```tsx
import React, { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GripVertical, Trash2, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

interface KanbanCardProps {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  isDragging?: boolean
}

const priorityConfig = {
  high: { color: 'bg-red-100 text-red-800 border-red-300', label: '高' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: '中' },
  low: { color: 'bg-green-100 text-green-800 border-green-300', label: '低' }
}

export const KanbanCard = memo(function KanbanCard({
  id,
  title,
  description,
  priority,
  createdAt,
  onDelete,
  onEdit,
  isDragging
}: KanbanCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <TooltipProvider>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          y: 0,
          rotate: isDragging ? 2 : 0 
        }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onDoubleClick={() => onEdit(id)}
      >
        <Card className={`mb-2 cursor-move transition-all border-2 ${
          priority === 'high' ? 'border-red-200' : 
          priority === 'medium' ? 'border-yellow-200' : 
          'border-green-200'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2">
              <GripVertical className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-medium truncate">{title}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>作成日: {format(createdAt, 'yyyy/MM/dd HH:mm')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex gap-1 flex-shrink-0">
                    {isHovered && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(id)
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
            <Badge className={priorityConfig[priority].color}>
              優先度: {priorityConfig[priority].label}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
})
```

## 3.3 パフォーマンス改善

### ハンズオン課題2: ストアの最適化

**`src/store/kanbanStore.ts`の特定部分を選択してCmd+K：**

```
選択部分を最適化：
- セレクターパターンの実装
- メモ化されたゲッター追加
- 不要な再レンダリング防止
- TypeScriptの型推論改善
```

### ハンズオン課題3: カスタムフックの作成

**新規ファイル`src/hooks/useKanban.ts`を作成し、Tab補完：**

```typescript
// Create custom hook for kanban operations with:
// - Memoized selectors for cards by status
// - Optimistic updates
// - Error handling
// - Loading states
// - Undo/redo functionality
```

**Tab補完が生成するコード例：**
```typescript
import { useCallback, useMemo } from 'react'
import { useKanbanStore } from '@/store/kanbanStore'
import { Card, Status } from '@/types/kanban'

export function useKanban() {
  const {
    cards,
    columns,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    history,
    historyIndex,
    undo,
    redo
  } = useKanbanStore()

  const cardsByStatus = useMemo(() => {
    const grouped: Record<Status, Card[]> = {
      todo: [],
      doing: [],
      done: []
    }
    
    cards.forEach(card => {
      if (grouped[card.status]) {
        grouped[card.status].push(card)
      }
    })
    
    return grouped
  }, [cards])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const optimisticAddCard = useCallback(async (
    status: Status,
    cardData: Partial<Card>
  ) => {
    const tempId = `temp-${Date.now()}`
    const optimisticCard = {
      ...cardData,
      id: tempId,
      status
    }
    
    addCard(status, optimisticCard)
    
    try {
      // API call would go here
      return true
    } catch (error) {
      deleteCard(tempId)
      throw error
    }
  }, [addCard, deleteCard])

  const getColumnCards = useCallback((columnId: string) => {
    return cardsByStatus[columnId as Status] || []
  }, [cardsByStatus])

  const getWipLimit = useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    return column?.wipLimit
  }, [columns])

  const isOverWipLimit = useCallback((columnId: string) => {
    const limit = getWipLimit(columnId)
    if (!limit) return false
    const cards = getColumnCards(columnId)
    return cards.length >= limit
  }, [getColumnCards, getWipLimit])

  return {
    cards,
    columns,
    cardsByStatus,
    addCard: optimisticAddCard,
    updateCard,
    deleteCard,
    moveCard,
    undo,
    redo,
    canUndo,
    canRedo,
    getColumnCards,
    isOverWipLimit
  }
}
```

## 3.4 UIの細かい調整

### ハンズオン課題4: アニメーションの洗練

**各コンポーネントのアニメーション部分を選択してCmd+K：**

```
Framer Motionのアニメーションを改善：
- staggerChildren でカードの順次表示
- ドラッグ時のelastic効果
- 削除時のscale + opacity アニメーション
- レイアウトアニメーションの最適化
```

### ハンズオン課題5: エラー処理の追加

**エラー処理が必要な箇所を選択してCmd+K：**

```
エラー処理を追加：
- try-catchブロック
- エラー時のトースト表示
- フォールバックUI
- リトライロジック
```

## 3.5 アクセシビリティの改善

### ハンズオン課題6: ARIA属性とキーボード操作

**コンポーネントを選択してCmd+K：**

```
アクセシビリティを改善：
- 適切なARIA属性（role, aria-label, aria-describedby）
- キーボードナビゲーション（Tab, Enter, Escape）
- フォーカス管理（focus-visible）
- スクリーンリーダー対応のテキスト
```

## 3.6 コード品質の向上

### ハンズオン課題7: リファクタリング

**重複コードや長い関数を選択してCmd+K：**

```
このコードをリファクタリング：
- 共通ロジックを抽出
- 定数を別ファイルに移動
- 関数を小さく分割
- 命名規則の統一
```

### ハンズオン課題8: TypeScript型の強化

**型定義を選択してCmd+K：**

```
TypeScript型を改善：
- ジェネリック型の活用
- ユーティリティ型（Pick, Omit, Partial）
- 型ガードの実装
- as const アサーション
```

## 3.7 テスト可能なコードへの改善

### ハンズオン課題9: テスタビリティの向上

**関数やコンポーネントを選択してCmd+K：**

```
テストしやすいコードに改善：
- 純粋関数への分離
- 依存性注入パターン
- モック可能な構造
- エッジケースの考慮
```

## 📝 この章で学んだこと

- ✅ Cmd+Kによるピンポイントな改善
- ✅ Tab補完での高速コード生成
- ✅ パフォーマンス最適化技術
- ✅ アクセシビリティの実装
- ✅ コード品質の向上手法

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

第4章では、AIコードレビュー機能を使って、コード品質をさらに向上させます。

---

### 課題チェックリスト

- [ ] コンポーネントの最適化
- [ ] カスタムフックの作成
- [ ] アニメーションの洗練
- [ ] エラー処理の追加
- [ ] アクセシビリティ改善
- [ ] TypeScript型の強化
- [ ] コードのリファクタリング