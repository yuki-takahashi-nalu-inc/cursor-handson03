# 第4章: Agent（Cmd+I）を使いこなす

## 学習目標
- Agent（Cmd+I）の主要モードを理解する
- Agentモードで自律的なタスク実行を体験
- 複数ファイルの同時編集を効率的に行う

## 4.1 Agentの基本

### Agentとは
- **起動方法**: Cmd+I（Mac）/ Ctrl+I（Windows/Linux）
- **特徴**: 複数ファイルを同時に編集、自律的なタスク実行
- **モード切り替え**: ⌘. でモード選択画面表示

### 主要モード

| モード | 用途 | 特徴 |
|--------|------|------|
| **Agent** | プロジェクト構築・自動化 | npmコマンド実行、ファイル作成、エラー対応 |
| **Ask** | コードに関する質問・相談 | 読み取り専用、ファイル変更なし |

※ Customモードも存在し、独自のワークフローを定義できますが、本カリキュラムではAgentとAskモードに焦点を当てます。

## 4.2 Agentモードでデータ永続化の実装

### ハンズオン課題1: ローカルストレージでのデータ永続化

**Agent（Cmd+I）を開いて、Agentモードを選択し、以下を入力：**

```
ローカルストレージを使用したデータ永続化機能を完全に実装してください。

要件：
1. src/utils/storage.ts でローカルストレージ操作のユーティリティ作成
2. src/store/kanbanStore.ts にローカルストレージとの同期機能追加
3. 自動保存機能の実装（変更があったら即座に保存）
4. データのマイグレーション機能（古いフォーマットから新しいフォーマットへ）
5. データのエクスポート/インポート機能
6. リセット機能（初期データに戻す）
7. エラーハンドリング（ストレージ容量超過など）

すべてのカード操作がローカルストレージに自動保存されるようにしてください。
```

**Agentモードの動作：**
1. ストレージユーティリティを作成
2. Zustandストアにミドルウェアを追加
3. 自動保存機能を実装
4. データの永続化を確認
5. エラーがあれば自動修正

**生成されるストレージコードの例：**
```typescript
// src/utils/storage.ts
interface StorageData {
  version: number
  cards: Card[]
  columns: Column[]
  updatedAt: string
}

const STORAGE_KEY = 'kanban-board-data'
const CURRENT_VERSION = 1

export const storage = {
  save: (data: Partial<StorageData>): void => {
    try {
      const existingData = storage.load()
      const newData: StorageData = {
        ...existingData,
        ...data,
        version: CURRENT_VERSION,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('ローカルストレージの容量が不足しています')
        // 古いデータをクリーンアップ
        storage.cleanup()
      }
    }
  },

  load: (): StorageData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null
      
      const parsed = JSON.parse(data)
      
      // データマイグレーション
      if (parsed.version < CURRENT_VERSION) {
        return storage.migrate(parsed)
      }
      
      return parsed
    } catch (error) {
      console.error('データの読み込みに失敗しました', error)
      return null
    }
  },

  migrate: (oldData: any): StorageData => {
    // バージョンごとのマイグレーション処理
    let migrated = { ...oldData }
    
    if (!migrated.version || migrated.version < 1) {
      // v0 → v1 のマイグレーション
      migrated = {
        version: 1,
        cards: oldData.tasks || oldData.cards || [],
        columns: oldData.columns || defaultColumns,
        updatedAt: new Date().toISOString()
      }
    }
    
    return migrated
  },

  reset: (): void => {
    localStorage.removeItem(STORAGE_KEY)
  },

  export: (): string => {
    const data = storage.load()
    return JSON.stringify(data, null, 2)
  },

  import: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString)
      storage.save(data)
      return true
    } catch {
      return false
    }
  }
}
```

## 4.3 Askモードでコード相談

### ハンズオン課題2: パフォーマンス最適化の相談

**Agent（Cmd+I）でAskモードを選択し、以下を質問：**

```
@src/store/kanbanStore.ts
@src/components

現在のかんばんボードアプリのパフォーマンスを改善したいです。

以下について最適な実装方法を教えてください：
1. 大量のカード（500枚以上）での動作
2. 再レンダリングの最小化
3. メモリ使用量の削減
4. 仮想スクロールの必要性

具体的なコード例も含めて提案してください。
```

**Askモードの回答例：**
- React.memoの適用箇所
- useCallbackの使用方法
- 仮想化ライブラリの提案
- Zustandのセレクター最適化

## 4.4 Zustandストアとローカルストレージの統合

### ハンズオン課題3: 状態管理とデータ永続化の連携

**Agent（Agentモード）で実装：**

```
Zustandストアとローカルストレージを完全に統合してください。

実装内容：
1. src/store/kanbanStore.ts にpersistミドルウェアを追加
2. カードの追加/編集/削除/移動時の自動保存
3. アプリ起動時のデータ復元
4. オプティミスティック更新（即座にUIを更新）
5. エラーハンドリングとロールバック
6. デバウンス処理で保存頻度を最適化

すべての状態変更が自動的にローカルストレージに永続化されるようにしてください。
```

**Agentが実行する統合コードの例：**
```typescript
// src/store/kanbanStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { storage } from '@/utils/storage'

interface KanbanStore {
  cards: Card[]
  columns: Column[]
  loading: boolean
  error: string | null
  
  // Actions
  addCard: (columnId: string, card: Partial<Card>) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  deleteCard: (id: string) => void
  moveCard: (cardId: string, newColumnId: string, newPosition: number) => void
  resetBoard: () => void
  importData: (jsonString: string) => boolean
  exportData: () => string
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', cards: [], limit: undefined },
  { id: 'doing', title: 'Doing', cards: [], limit: 3 },
  { id: 'done', title: 'Done', cards: [], limit: undefined }
]

export const useKanbanStore = create<KanbanStore>()(
  persist(
    immer((set, get) => ({
      cards: [],
      columns: initialColumns,
      loading: false,
      error: null,

      addCard: (columnId, cardData) => {
        set((state) => {
          const newCard: Card = {
            id: `card-${Date.now()}`,
            title: cardData.title || '',
            description: cardData.description,
            priority: cardData.priority || 'medium',
            status: columnId as Status,
            tags: cardData.tags || [],
            assignee: cardData.assignee,
            dueDate: cardData.dueDate,
            createdAt: Date.now()
          }
          
          state.cards.push(newCard)
          
          const column = state.columns.find(col => col.id === columnId)
          if (column) {
            column.cards.push(newCard.id)
          }
        })
      },

      updateCard: (id, updates) => {
        set((state) => {
          const cardIndex = state.cards.findIndex(c => c.id === id)
          if (cardIndex !== -1) {
            state.cards[cardIndex] = { ...state.cards[cardIndex], ...updates }
          }
        })
      },

      deleteCard: (id) => {
        set((state) => {
          state.cards = state.cards.filter(c => c.id !== id)
          state.columns.forEach(column => {
            column.cards = column.cards.filter(cardId => cardId !== id)
          })
        })
      },

      moveCard: (cardId, newColumnId, newPosition) => {
        set((state) => {
          // Remove card from current column
          state.columns.forEach(column => {
            column.cards = column.cards.filter(id => id !== cardId)
          })
          
          // Add to new column at position
          const targetColumn = state.columns.find(col => col.id === newColumnId)
          if (targetColumn) {
            targetColumn.cards.splice(newPosition, 0, cardId)
          }
          
          // Update card status
          const card = state.cards.find(c => c.id === cardId)
          if (card) {
            card.status = newColumnId as Status
          }
        })
      },

      resetBoard: () => {
        set({
          cards: [],
          columns: initialColumns,
          error: null
        })
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString)
          set({
            cards: data.cards || [],
            columns: data.columns || initialColumns
          })
          return true
        } catch {
          set({ error: 'データのインポートに失敗しました' })
          return false
        }
      },

      exportData: () => {
        const state = get()
        return JSON.stringify({
          cards: state.cards,
          columns: state.columns,
          exportedAt: new Date().toISOString()
        }, null, 2)
      }
    })),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cards: state.cards,
        columns: state.columns
      })
    }
  )
)
```

## 4.5 エラー対応と自動修正

### ハンズオン課題4: TypeScriptエラーの一括修正

**Agent（Agentモード）で依頼：**

```
プロジェクト全体のTypeScriptエラーを修正してください：

1. npm run type-check を実行
2. すべてのエラーを確認
3. 自動的に修正
4. 修正できないものは報告

strictモードに対応させてください。
```

## 4.6 プロジェクトの仕上げ

### ハンズオン課題5: かんばんボードアプリの最終調整

**Agent（Agentモード）で総仕上げ：**

```
かんばんボードアプリの最終調整を行ってください：

【データ永続化】
1. ローカルストレージの容量チェック機能
2. データ圧縮機能の実装（大量カード対応）
3. 自動バックアップ機能（定期的なエクスポート）
4. データ復元機能の強化

【フロントエンド】
1. ローディング状態の実装
2. エラー表示UI（トースト通知）
3. 空状態のUI（カードがない時の表示）
4. Framer Motionでアニメーション追加
5. レスポンシブ対応（モバイル・タブレット）

【UX改善】
1. ドラッグ&ドロップのビジュアルフィードバック強化
2. キーボードショートカットの実装
3. アクセシビリティ対応（ARIA属性）

すべて自動で実行し、完了したら報告してください。
```

## 📝 この章で学んだこと

- ✅ Agentの主要モード（Agent、Ask）
- ✅ Agentモードでの自律的なタスク実行
- ✅ 複数ファイルの同時編集
- ✅ エラーの自動修正
- ✅ プロジェクト全体の一括更新

## 💡 Agent活用のコツ

### モードの使い分け

**Agentモード：**
- プロジェクトの構築
- パッケージのインストール
- ファイルの作成・更新
- エラーの自動修正

**Askモード：**
- コードの相談
- ベストプラクティスの質問
- 実装方法の提案


### 効果的な指示

1. **明確なゴールを設定**
```
「Zustandで状態管理を実装し、すべてのコンポーネントを接続」
```

2. **対象を明確に**
```
「src/components配下のすべてのファイルを更新」
```

3. **期待する結果を記述**
```
「TypeScriptのstrictモードでエラーが出ないように」
```

## 🎯 チャレンジ課題

Agentを使って以下を実装：

1. 国際化（i18n）対応
2. PWA化（オフライン対応）
3. アニメーションライブラリの統合
4. E2Eテストの追加

## 🚀 次の章へ

第5章では、AIコードレビュー機能を使って、作成したコードの品質を向上させます。

---

### 課題チェックリスト

- [ ] Agentモードで状態管理実装
- [ ] Askモードで最適化相談
- [ ] フルスタック連携の実装
- [ ] TypeScriptエラーの修正
- [ ] プロジェクトの最終調整