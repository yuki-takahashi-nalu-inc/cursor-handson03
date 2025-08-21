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

## 4.2 Agentモードでバックエンド自動構築

### ハンズオン課題1: Express + SQLiteサーバーの完全構築

**Agent（Cmd+I）を開いて、Agentモードを選択し、以下を入力：**

```
Express + SQLiteでバックエンドAPIを完全に構築してください。

要件：
1. 必要なパッケージのインストール（express, better-sqlite3, cors, nodemon）
2. backend/server.js の作成
3. backend/db/database.js でSQLite接続
4. backend/db/schema.sql でテーブル定義
5. backend/routes/cards.js でRESTful API実装
6. データベースの初期化と初期データ投入
7. package.jsonにサーバー起動スクリプト追加

すべて自動で実行し、http://localhost:3001 でAPIサーバーを起動できるようにしてください。
```

**Agentモードの動作：**
1. 必要なパッケージを自動インストール
2. バックエンドファイル構造を作成
3. SQLiteデータベースを初期化
4. APIエンドポイントを実装
5. エラーがあれば自動修正

**生成されるサーバーコードの例：**
```javascript
// backend/server.js
const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Database setup
const db = new Database('kanban.db')

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
const initDB = () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
      column_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS columns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `
  db.exec(schema)
  
  // Insert initial columns if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM columns').get()
  if (count.count === 0) {
    const insertColumns = db.prepare('INSERT INTO columns (id, title, position) VALUES (?, ?, ?)')
    insertColumns.run('todo', 'To Do', 0)
    insertColumns.run('doing', 'Doing', 1)
    insertColumns.run('done', 'Done', 2)
  }
}

initDB()

// Routes
app.use('/api/cards', require('./routes/cards'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
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

## 4.4 フロントエンドとバックエンドの統合

### ハンズオン課題3: フルスタック連携の実装

**Agent（Agentモード）で実装：**

```
フロントエンドとバックエンドを完全に統合してください。

実装内容：
1. src/services/api.js でAPI通信層を作成
2. src/hooks/useKanban.ts でAPIを使用するカスタムフック
3. Zustandストアをバックエンドと同期
4. リアルタイムでのCRUD操作
5. エラーハンドリングとローディング状態
6. オプティミスティック更新の実装

すべてのコンポーネントがSQLiteデータベースと連携するようにしてください。
```

**Agentが実行する統合コードの例：**
```typescript
// src/store/kanbanStore.ts
import { create } from 'zustand'
import { cardAPI } from '@/services/api'

interface KanbanStore {
  cards: Card[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchCards: () => Promise<void>
  addCard: (columnId: string, card: Partial<Card>) => Promise<void>
  deleteCard: (id: string) => Promise<void>
  moveCard: (id: string, columnId: string, position: number) => Promise<void>
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  fetchCards: async () => {
    set({ loading: true, error: null })
    try {
      const cards = await cardAPI.getAll()
      set({ cards, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addCard: async (columnId, cardData) => {
    // Optimistic update
    const tempCard = { ...cardData, id: `temp-${Date.now()}`, column_id: columnId }
    set(state => ({ cards: [...state.cards, tempCard] }))
    
    try {
      const newCard = await cardAPI.create({ ...cardData, column_id: columnId })
      set(state => ({
        cards: state.cards.map(c => c.id === tempCard.id ? newCard : c)
      }))
    } catch (error) {
      // Rollback on error
      set(state => ({
        cards: state.cards.filter(c => c.id !== tempCard.id),
        error: error.message
      }))
    }
  },

  // Other actions...
}))
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

### ハンズオン課題5: フルスタックアプリの最終調整

**Agent（Agentモード）で総仕上げ：**

```
フルスタックかんばんボードアプリの最終調整を行ってください：

【バックエンド】
1. SQLiteトランザクション処理の実装
2. エラーハンドリングの強化
3. バリデーションの追加
4. ログ出力の実装

【フロントエンド】
1. ローディング状態の実装
2. エラー表示UI
3. 空状態のUI
4. アニメーション追加
5. レスポンシブ対応

【統合テスト】
1. APIエンドポイントの動作確認
2. CRUD操作の検証

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