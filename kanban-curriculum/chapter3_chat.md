# 第3章: チャット（Cmd+L）で複雑なロジック実装

## 学習目標
- チャット機能で対話的に開発する方法を習得
- 複雑なドラッグ&ドロップ機能の実装
- エラー解決をAIに相談する方法を学ぶ

## 3.1 チャット機能の基本

### チャットパネルの使い方
- **Cmd+L（Ctrl+L）**: チャットパネルを開く
- **@ファイル名**: 特定のファイルをコンテキストに追加
- **@フォルダ名**: フォルダ全体を参照
- **コードブロック**: バッククォート3つで囲む

### コンテキストの重要性
チャットは開いているファイルや@で指定したファイルを理解して回答します。

## 3.2 React Beautiful DnDの導入

### ハンズオン課題1: ドラッグ&ドロップライブラリの設定

**チャット（Cmd+L）に以下を入力：**

```
React Beautiful DnDを使ってドラッグ&ドロップ機能を実装したいです。

@src/components/Board/Board.tsx
@src/components/Column/KanbanColumn.tsx  
@src/components/Card/KanbanCard.tsx

以下を実装してください：
1. 必要なライブラリのインストール
2. DragDropContextの設定
3. Droppableでカラムを囲む
4. Draggableでカードを囲む
5. onDragEndハンドラーの実装
```

**Cursorが提案する実装例：**

```bash
npm install react-beautiful-dnd
npm install -D @types/react-beautiful-dnd
```

```tsx
// Board.tsx の修正例
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

const handleDragEnd = (result: DropResult) => {
  const { destination, source, draggableId } = result
  
  if (!destination) return
  
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return
  }
  
  // カードの移動ロジック
}

return (
  <DragDropContext onDragEnd={handleDragEnd}>
    {/* カラムのレンダリング */}
  </DragDropContext>
)
```

## 3.3 バックエンドAPIの実装

### ハンズオン課題2: Express APIサーバーの構築

**チャットで質問：**

```
@backend/server.js @backend/routes/cards.js

Express + SQLiteでRESTful APIを実装してください：

1. GET /api/cards - 全カード取得
2. POST /api/cards - カード作成
3. PUT /api/cards/:id - カード更新
4. DELETE /api/cards/:id - カード削除
5. PUT /api/cards/:id/move - カード移動

better-sqlite3を使用して、エラーハンドリングも含めて実装してください。
```

**生成されるAPIコード例：**
```javascript
// backend/server.js
const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')

const app = express()
const db = new Database('kanban.db')

app.use(cors())
app.use(express.json())

// カード一覧取得
app.get('/api/cards', (req, res) => {
  try {
    const cards = db.prepare('SELECT * FROM cards ORDER BY column_id, position').all()
    res.json(cards)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// カード作成
app.post('/api/cards', (req, res) => {
  const { title, description, priority, column_id } = req.body
  try {
    const stmt = db.prepare(`
      INSERT INTO cards (id, title, description, priority, column_id, position)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const id = Date.now().toString()
    const position = db.prepare('SELECT MAX(position) as max FROM cards WHERE column_id = ?')
      .get(column_id)?.max || 0
    
    stmt.run(id, title, description, priority, column_id, position + 1)
    res.json({ id, title, description, priority, column_id, position: position + 1 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## 3.4 エラー解決の実践

### ハンズオン課題3: よくあるエラーと解決

**エラーが発生した場合の質問方法：**

```
以下のエラーが発生しています：

エラーメッセージ：
```
Unable to find draggable with id: card-1
```

関連ファイル：
@src/components/Card/KanbanCard.tsx
@src/components/Column/KanbanColumn.tsx

このエラーの原因と解決方法を教えてください。
```

**Cursorが提供する解決策の例：**
- Draggable要素のidが一意でない
- DraggableのindexプロパティがString型になっている
- React.StrictModeとの競合

## 3.5 フロントエンドとAPIの連携

### ハンズオン課題4: API通信の実装

**チャットで依頼：**

```
@src/services/api.js

axiosを使ってバックエンドAPIと通信するサービスを作成してください：

1. カード一覧の取得
2. カードの作成
3. カードの更新  
4. カードの削除
5. カードの移動

エラーハンドリングも含めて実装してください。
```

**生成されるAPIサービス例：**
```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const cardAPI = {
  // 全カード取得
  async getAll() {
    try {
      const response = await api.get('/cards')
      return response.data
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      throw error
    }
  },

  // カード作成
  async create(card) {
    try {
      const response = await api.post('/cards', card)
      return response.data
    } catch (error) {
      console.error('Failed to create card:', error)
      throw error
    }
  },

  // カード更新
  async update(id, updates) {
    try {
      const response = await api.put(`/cards/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Failed to update card:', error)
      throw error
    }
  },

  // カード削除
  async delete(id) {
    try {
      await api.delete(`/cards/${id}`)
    } catch (error) {
      console.error('Failed to delete card:', error)
      throw error
    }
  },

  // カード移動
  async move(id, targetColumnId, position) {
    try {
      const response = await api.put(`/cards/${id}/move`, {
        column_id: targetColumnId,
        position
      })
      return response.data
    } catch (error) {
      console.error('Failed to move card:', error)
      throw error
    }
  }
}
```

## 3.6 パフォーマンス最適化

### ハンズオン課題5: レンダリング最適化

**チャットで相談：**

```
@src/components

かんばんボードのパフォーマンスを最適化したいです：

1. 不要な再レンダリングを防ぐ
2. React.memoの適切な使用
3. useCallbackとuseMemoの活用
4. 大量のカードでも快適に動作

どのように実装すればよいですか？
```

## 3.7 キーボードショートカット

### ハンズオン課題6: アクセシビリティ向上

**チャットで質問：**

```
キーボードショートカットを実装したいです：

- Nキー: 新規カード追加
- Delete/Backspace: 選択カードを削除
- 矢印キー: カード選択の移動
- Enter: カード編集
- Escape: 操作のキャンセル

React Hook形式で実装してください。
```

## 📝 この章で学んだこと

- ✅ チャット機能での対話的開発
- ✅ コンテキスト（@ファイル）の活用
- ✅ 複雑なロジックの実装依頼方法
- ✅ エラー解決の相談方法
- ✅ カスタムフックへのリファクタリング

## 💡 チャット活用のベストプラクティス

### 効果的な質問の仕方

1. **コンテキストを提供**
```
@src/components/Board @src/types
これらのファイルを参考に...
```

2. **具体的な要件を伝える**
```
❌ 「動かない」
✅ 「ドラッグ時にエラー: Unable to find draggable」
```

3. **期待する結果を明確に**
```
TypeScriptで型安全に、エラーハンドリングも含めて
```

### 段階的な開発

1. まず基本機能を実装
2. 動作確認
3. エラーがあれば相談
4. 最適化や機能追加

## 🎯 チャレンジ課題

チャット機能を使って以下を実装：

1. カードのフィルタリング機能
2. 検索機能（リアルタイム）
3. カードの並び替え（作成日、優先度）
4. 複数カード選択と一括操作

## 🚀 次の章へ

第4章では、Agent（Cmd+I）のAgentモードとAskモードを使いこなして、プロジェクト全体を効率的に構築します。

---

### 課題チェックリスト

- [ ] React Beautiful DnDの導入
- [ ] ドラッグ&ドロップ実装
- [ ] 状態管理ロジックの構築
- [ ] カスタムフックの作成
- [ ] エラー解決の実践
- [ ] パフォーマンス最適化