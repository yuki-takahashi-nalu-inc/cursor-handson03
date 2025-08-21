# かんばんボードアプリケーション仕様書

## プロジェクト概要

Cursorの学習を目的とした、シンプルなかんばんボードアプリケーション。
このファイルは`@SPEC.md`でCursorに参照させることで、一貫性のあるコード生成を促します。

## 技術スタック

### フロントエンド
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: React Beautiful DnD
- **State Management**: Zustand
- **Icons**: Lucide React

### バックエンド
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite3
- **ORM/Query Builder**: Better-sqlite3

### 開発環境
- **IDE**: Cursor
- **Version Control**: Git
- **Package Manager**: npm/yarn

## 機能要件

### コア機能（必須）

#### 1. かんばんボード
- **3つのカラム**: To Do, Doing, Done
- **カード管理**:
  - 作成（タイトル、説明、優先度）
  - 編集（インライン編集対応）
  - 削除（確認ダイアログ付き）
  - 移動（ドラッグ&ドロップ）

#### 2. ドラッグ&ドロップ
- カラム内での並び替え
- カラム間での移動
- ビジュアルフィードバック
- モバイル対応

#### 3. データ永続化
- SQLiteデータベース保存
- RESTful API経由でのCRUD操作
- 自動保存
- データのエクスポート/インポート


## データモデル

### Card（カード）
```typescript
interface Card {
  id: string                // UUID
  title: string             // カードタイトル
  description?: string      // 詳細説明
  priority: Priority        // 優先度
  tags?: string[]          // タグ
  createdAt: Date          // 作成日時
  updatedAt: Date          // 更新日時
}

type Priority = 'high' | 'medium' | 'low'
```

### Column（カラム）
```typescript
interface Column {
  id: string               // カラムID
  title: string           // カラム名
  cards: Card[]           // カード配列
  color?: string          // テーマカラー
  limit?: number          // WIPリミット
}
```

### Board（ボード）
```typescript
interface Board {
  id: string              // ボードID
  name: string            // ボード名
  columns: Record<string, Column>  // カラム群
  createdAt: Date         // 作成日時
  updatedAt: Date         // 更新日時
}
```

## UI/UXデザイン

### レイアウト
```
┌─────────────────────────────────────────┐
│  Header (Title, Search, Theme Toggle)   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │  To Do   │ │  Doing   │ │   Done   ││
│  │          │ │          │ │          ││
│  │  [Card]  │ │  [Card]  │ │  [Card]  ││
│  │  [Card]  │ │  [Card]  │ │  [Card]  ││
│  │  [Card]  │ │          │ │  [Card]  ││
│  │          │ │          │ │          ││
│  │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  ││
│  └──────────┘ └──────────┘ └──────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### カラーパレット

#### ライトモード
- Background: `#f9fafb`
- Card: `#ffffff`
- Text: `#111827`
- Primary: `#3b82f6`
- High Priority: `#ef4444`
- Medium Priority: `#f59e0b`
- Low Priority: `#10b981`

#### ダークモード
- Background: `#111827`
- Card: `#1f2937`
- Text: `#f9fafb`
- Primary: `#60a5fa`
- High Priority: `#f87171`
- Medium Priority: `#fbbf24`
- Low Priority: `#34d399`

## データベース設計

### SQLiteテーブル構造

```sql
-- cards テーブル
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
  column_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- columns テーブル
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API設計

### エンドポイント

- `GET /api/cards` - 全カード取得
- `GET /api/cards/:id` - 特定カード取得
- `POST /api/cards` - カード作成
- `PUT /api/cards/:id` - カード更新
- `DELETE /api/cards/:id` - カード削除
- `PUT /api/cards/:id/move` - カード移動

## ディレクトリ構造

```
kanban-board-app/
├── backend/
│   ├── server.js         # Expressサーバー
│   ├── db/
│   │   ├── database.js   # SQLite接続
│   │   └── schema.sql    # テーブル定義
│   └── routes/
│       └── cards.js      # APIルート
├── src/
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   └── Board.css
│   │   ├── Column/
│   │   │   ├── Column.tsx
│   │   │   └── Column.css
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── Card.css
│   │   ├── SearchBar/
│   │   │   └── SearchBar.tsx
│   │   ├── ThemeToggle/
│   │   │   └── ThemeToggle.tsx
│   │   └── ui/
│   │       └── (shadcn/ui components)
│   ├── hooks/
│   │   ├── useKanban.ts
│   │   ├── useTheme.ts
│   │   └── useSearch.ts
│   ├── store/
│   │   ├── kanbanStore.ts
│   │   └── themeStore.ts
│   ├── types/
│   │   └── kanban.ts
│   ├── utils/
│   │   ├── export.ts
│   │   ├── validation.ts
│   │   └── monitoring.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── themes.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .cursorrules
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

## 成功基準

- ✅ 基本的なかんばん機能の実装
- ✅ ドラッグ&ドロップの動作
- ✅ データの永続化
- ✅ Cursorの主要機能を活用

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Active Development