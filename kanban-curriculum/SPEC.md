# かんばんボードアプリケーション仕様書

## プロジェクト概要

Cursorの学習を目的とした、シンプルなかんばんボードアプリケーション。
このファイルは`@SPEC.md`でCursorに参照させることで、一貫性のあるコード生成を促します。

## 技術スタック

### フロントエンド
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 (重要: v3を使用、v4は使用しない)
  - v3を使用する理由：安定性、エコシステムの互換性、設定の一貫性
  - v4はPostCSS設定が大きく異なるため注意が必要
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### 必要な依存関係
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^10.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-label": "^2.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.0",
    "@radix-ui/react-separator": "^1.0.0",
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.200.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.0",
    "zustand": "^4.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "@tailwindcss/forms": "^0.5.0"
  }
}
```

### 重要な設定ファイル

#### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},  // 重要: 'tailwindcss'を使用（v3の設定）
    autoprefixer: {},
  },
}
// 注意: Tailwind CSS v4では '@tailwindcss/postcss' を使用するが、
// v3では 'tailwindcss' を使用する
```

#### tailwind.config.js
```javascript
module.exports = {  // 重要: module.exportsを使用（CommonJS形式）
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS変数を使用したカラー定義
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... 他のカラー定義
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms")
  ],
}
// 注意: export defaultではなくmodule.exportsを使用
```

### 開発環境
- **IDE**: Cursor
- **Version Control**: Git
- **Package Manager**: npm/yarn

## 機能要件

### コア機能（必須）

#### 1. かんばんボード
- **3つのカラム**: To Do, Doing, Done
- **カード管理**:
  - 作成（タイトル、説明、優先度、タグ、担当者、期限）
  - 編集（ダイアログによる編集）
  - 削除（ドロップダウンメニューから削除）
  - 移動（ドラッグ&ドロップ）

#### 2. ドラッグ&ドロップ
- カラム間での移動
- ビジュアルフィードバック（ホバー効果）
- グラブ/グラビングカーソル表示

#### 3. データ永続化
- ローカルストレージ保存
- 自動保存
- リセット機能

#### 4. 検索・フィルタリング
- タイトル/説明/タグによる検索
- タグによる複数条件フィルタリング
- タグ選択UI（ポップオーバー）

#### 5. WIP（Work In Progress）管理
- Doingカラムの作業制限設定
- プログレスバーによる視覚化
- 制限超過時の警告表示


## データモデル

### Task（タスク）
```typescript
interface Task {
  id: string                // UUID
  title: string             // タスクタイトル
  description?: string      // 詳細説明
  status: Status           // ステータス
  priority: Priority        // 優先度
  tags: string[]           // タグ
  assignee?: {             // 担当者
    name: string
    avatar?: string
  }
  dueDate?: string         // 期限（ISO形式）
  createdAt: number        // 作成日時（エポックミリ秒）
}

type Status = 'todo' | 'doing' | 'done'
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
┌─────────────────────────────────────────────────────┐
│  Header                                             │
│  ├─ Title: リッチKanban                             │
│  ├─ Description: シンプルだけど手触りの良さに        │
│  │   こだわったカンバン                             │
│  └─ Actions: [リセット] [新規タスク]                │
├─────────────────────────────────────────────────────┤
│  Toolbar                                            │
│  ├─ Search: [検索ボックス] [タグフィルター]         │
│  └─ WIP Monitor: プログレスバー & カウント          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐     │
│  │ To Do (n)  │ │ Doing (n)  │ │ Done (n)   │     │
│  ├────────────┤ ├────────────┤ ├────────────┤     │
│  │            │ │            │ │            │     │
│  │ [Task Card]│ │ [Task Card]│ │ [Task Card]│     │
│  │  - Title   │ │  - Title   │ │  - Title   │     │
│  │  - Priority│ │  - Priority│ │  - Priority│     │
│  │  - Desc    │ │  - Desc    │ │  - Desc    │     │
│  │  - Tags    │ │  - Tags    │ │  - Tags    │     │
│  │  - Due Date│ │  - Assignee│ │  - Assignee│     │
│  │  - Assignee│ │            │ │            │     │
│  │  [⋮ Menu]  │ │            │ │            │     │
│  │            │ │            │ │            │     │
│  └────────────┘ └────────────┘ └────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### UIコンポーネント詳細

#### タスクカード
- タイトル（必須）
- 優先度バッジ（Low/Medium/High）
- 説明文（最大2行表示、省略可）
- タグ（複数表示可能）
- 期限（カレンダーアイコン付き）
- 担当者アバター（イニシャル表示）
- アクションメニュー（編集/削除）

#### ダイアログ（タスク編集）
- タイトル入力
- 説明入力（複数行）
- 優先度選択（ボタングループ）
- ステータス選択（ボタングループ）
- 担当者入力
- 期限選択（日付ピッカー）
- タグ管理（追加/削除）

#### フィルタリングUI
- 検索ボックス（リアルタイム検索）
- タグフィルター（ポップオーバー）
- アクティブフィルターの表示
- フィルタークリアボタン

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

## ディレクトリ構造

```
kanban-board-app/
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

## トラブルシューティング

### よくある問題と解決方法

#### 1. Tailwind CSSのスタイルが適用されない
**原因**: PostCSS設定の誤りまたはTailwind CSSバージョンの不一致
**解決方法**:
- `postcss.config.js`で`tailwindcss: {}`を使用（v3の場合）
- `npm list tailwindcss`でバージョンを確認（v3.x.xであること）
- 開発サーバーを再起動

#### 2. PostCSS設定エラー
**エラー例**: `Cannot find module '@tailwindcss/postcss'`
**原因**: Tailwind CSS v4の設定をv3で使用している
**解決方法**:
```javascript
// 誤り（v4の設定）
plugins: { '@tailwindcss/postcss': {} }
// 正しい（v3の設定）
plugins: { tailwindcss: {} }
```

#### 3. tailwind.config.jsのエラー
**原因**: ES modulesとCommonJSの混在
**解決方法**: `module.exports`を使用（`export default`ではない）

### バージョン確認コマンド
```bash
# Tailwind CSSのバージョン確認
npm list tailwindcss

# Node.jsのバージョン確認
node --version

# 依存関係の確認
npm list --depth=0
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