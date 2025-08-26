# 第5章: 実践テクニックとトラブルシューティング

## 学習目標
- AIに効果的な指示を出すプロンプトの書き方を学ぶ
- AIペアプログラミングでよくあるトラブルと解決方法を理解
- チーム開発でAIと協働する方法を学ぶ

## 6.1 効果的なプロンプトの書き方

### プロンプトエンジニアリングの基本

#### 良いプロンプトの要素
1. **明確な目的**
2. **具体的な要件**
3. **期待する出力形式**
4. **制約条件**

### プロンプトの実例比較

#### ❌ 悪い例
```
フォームを作って
```

#### ✅ 良い例
```
shadcn/uiのForm、Input、Buttonコンポーネントを使用して、
カード追加フォームを作成してください。

要件：
- タイトル（必須、最大50文字）
- 説明（任意、最大200文字）
- 優先度選択（high/medium/low）
- バリデーションエラーの表示
- Enterキーで送信、Escapeでキャンセル

TypeScriptで型安全に実装してください。
```

### コンテキストの提供方法

#### @記法の活用
```
@src/types/kanban.ts @src/components/Card
これらのファイルの型定義とコンポーネント構造を参考に、
新しいカード編集機能を実装してください。
```

#### 段階的な指示
```
ステップ1: 基本的なフォームコンポーネントを作成
ステップ2: バリデーションを追加
ステップ3: キーボードショートカットを実装
ステップ4: アニメーションを追加
```

## 6.2 よくあるトラブルと解決法

### トラブル1: Tab補完が効かない

**症状：**
- Tabを押してもコード補完されない
- 提案が表示されない

**解決法：**
```
1. より詳細なコメントを書く
// Create a React component with TypeScript props interface

2. ファイルの拡張子を確認（.tsx, .ts）

3. .cursorrulesファイルでプロジェクトのコンテキストを明確に

4. Settings → Features → Auto-completion を確認
```

### トラブル2: Agentが期待通りに動作しない

**症状：**
- ファイルが作成されない
- 部分的な更新しかされない

**解決法：**
```
1. Agentモードを選択しているか確認

2. より具体的な指示を出す
「src/components/NewComponent.tsxを作成して、以下の機能を実装」

3. 権限の問題がないか確認
「ターミナルでnpmコマンドの実行を許可」

4. エラーメッセージを確認して再度指示
```

### トラブル3: 生成されたコードにエラーがある

**症状：**
- TypeScriptエラー
- インポートエラー
- 実行時エラー

**解決法：**
```
エラー全文をコピーしてチャットに貼り付け：

「以下のエラーが発生しています：
[エラーメッセージ]

@問題のファイル
このエラーを修正してください。」
```

### トラブル4: パフォーマンスが遅い

**症状：**
- Cursorの応答が遅い
- コード生成に時間がかかる

**解決法：**
```
1. 不要なファイルを閉じる
2. プロジェクトのインデックスを再構築
   - Cmd+Shift+P → "Reload Window" または "Developer: Reload Window"
   - または、Cursorを再起動
3. モデルを変更（より軽いモデルを選択）
4. .cursorignoreファイルで大きなファイルを除外
```

**.cursorignoreファイルの役割：**
- Cursorがインデックス作成時に無視するファイル/ディレクトリを指定
- .gitignoreと同じ形式で記述
- パフォーマンス改善とコンテキストの質向上に効果的

**.cursorignoreファイルの例：**
```gitignore
# ビルド成果物
dist/
build/
out/
*.min.js
*.min.css

# 依存関係
node_modules/
.pnp
.pnp.js
vendor/
bower_components/

# ログファイル
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 大きなメディアファイル
*.mp4
*.mp3
*.mov
*.avi
*.zip
*.tar.gz
*.rar

# 環境ファイル
.env
.env.local
.env.production

# IDE設定
.idea/
*.swp
*.swo
*~

# OS関連
.DS_Store
Thumbs.db
Desktop.ini

# テスト関連
coverage/
.nyc_output/
*.test.js.snap

# 一時ファイル
tmp/
temp/
cache/
```

## 6.3 .cursorrulesの最適化

### 効果的な.cursorrulesの書き方

```text
# Project: Kanban Board Application

## Project Context
This is a kanban board with drag-and-drop functionality.
Main features: Create, move, and delete cards across columns.

## Tech Stack
- React 18 with TypeScript (strict mode)
- Vite for build
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Beautiful DnD for drag-drop
- Zustand for state management

## Code Generation Rules

### Always Use
- TypeScript with explicit types (no any)
- Functional components with hooks
- Tailwind classes instead of CSS files
- shadcn/ui components when available

### Never Use
- Class components
- Inline styles
- console.log in production code
- var keyword (use const/let)

## File Structure
src/
  components/   # React components
  hooks/        # Custom hooks
  store/        # Zustand stores
  types/        # TypeScript types
  utils/        # Utility functions

## Best Practices
- Memoize expensive components
- Handle errors with try-catch
- Add loading states
- Implement proper accessibility
- Write self-documenting code

## Performance Requirements
- Components must use React.memo when appropriate
- Event handlers should use useCallback
- Computed values should use useMemo
- Lazy load heavy components

## Testing
- Write tests for all utils
- Component tests for critical features
- Use React Testing Library
```

## 6.4 チーム開発での活用

### チーム用設定の共有

#### プロジェクトレベルの設定
最近のCursorでは、これまで使用してきた`.cursorrules`に加えて、`.cursor/rules`ディレクトリでAIの振る舞いをより細かく制御することも推奨されています。
詳細は[公式ドキュメント](https://docs.cursor.com/ja/context/rules)を参照してください。

#### コードレビューのワークフロー
```
1. 開発者A: 機能実装
2. 開発者A: AIレビューを実施
   「@変更ファイル セキュリティとパフォーマンスの観点でレビュー」
3. 開発者A: AIの指摘を修正
4. 開発者B: 人間によるレビュー
5. マージ
```

### ペアプログラミングwith Cursor

```
開発者1: 「この機能の実装方法を相談したい」
↓
Agent (Askモード): 実装案を提示
↓
開発者2: 「この方法でセキュリティ的に問題ないか？」
↓
チャット: セキュリティレビューを実施
↓
両者で実装を進める
```

## 6.5 生産性を最大化するTips

### ショートカットの活用

```
頻繁に使うショートカット：

1. Cmd+K → 選択部分を即座に改善
2. Cmd+L → 疑問をすぐに質問
3. Cmd+I → 大規模な変更を実行
4. Tab → 次の行を予測させる

カスタムショートカットの設定：
Preferences → Keyboard Shortcuts
```

### コンテキストウィンドウの管理

```
効率的なコンテキスト管理：

1. 関連ファイルだけを開く
2. @記法で必要なファイルだけ参照
3. 不要なタブは閉じる
4. .cursorignoreで大きなファイルを除外
```

### バッチ処理の活用

```
複数のタスクを一度に依頼：

Agent (Agentモード):
「以下をすべて実行してください：
1. 全コンポーネントにローディング状態を追加
2. エラーハンドリングを実装
3. TypeScriptのany型をすべて修正
4. 未使用のインポートを削除
5. テストファイルを生成」
```

## 📝 この章でAIペアプログラミングを通じて学んだこと

- ✅ AIへの効果的なプロンプトの書き方
- ✅ AIと協働する際のトラブルシューティング
- ✅ .cursorrulesでAIの動作を最適化
- ✅ チーム開発でAIを活用する方法
- ✅ AIペアプログラミングで生産性を向上させるTips

## 🎉 Cursorマスター認定

### AIペアプログラミングであなたができるようになったこと：

1. **AIとの対話スキル**
   - Tab補完、Cmd+K、Cmd+L、Cmd+I でAIと効果的に対話

2. **AIとの共同開発**
   - AIと協働して6-10倍の開発速度を体験

3. **AIレビューの活用**
   - AIにコード品質をチェックしてもらう

4. **AIとの問題解決**
   - AIと協働してエラーやトラブルを解決

5. **AIを活用したチーム開発**
   - AIペアプログラミングでチーム効率を向上

## 6.6 【補足】MCPサーバーで開発効率を向上（上級者向け）

### MCP (Model Context Protocol) とは

MCPサーバーは、Cursorに外部ツールやサービスを統合できる仕組みです。
これにより、様々な開発ツールをCursorから直接操作でき、開発効率が大幅に向上します。

### 利用可能なMCPサーバー例

- **Notion**: ドキュメント管理と連携
- **GitHub**: リポジトリ操作、Issue管理
- **Figma**: デザインデータの参照
- **Linear**: タスク管理
- **Playwright**: ブラウザ自動操作
- **Postgres/SQLite**: データベース操作
- その他多数

### MCPサーバーの追加方法

**簡単なGUI操作で追加：**

1. Cursorの設定を開く（Cmd+, / Ctrl+,）
2. 「MCP」セクションを選択
3. 「Add MCP Server」をクリック
4. [公式MCPディレクトリ](https://docs.cursor.com/en/tools/mcp#mcp-servers)から必要なツールを選択
5. 「Add to Cursor」ボタンをクリック
6. 必要な認証情報を入力

### 実践例: GitHubとの連携

```
MCPサーバー追加後の使用例：

チャット: 「GitHubのIssue #123の内容を確認して」
→ MCPが自動的にGitHub APIにアクセスして情報取得

Agent: 「このPRのレビューコメントを反映して修正」
→ GitHub上のコメントを読み取り、コードを自動修正
```

### MCPサーバー活用のメリット

1. **コンテキストの拡張**: 外部サービスのデータを直接参照
2. **自動化の強化**: 複数ツールを横断した作業の自動化
3. **ワークフロー統合**: 開発フロー全体をCursor内で完結

### 注意事項

- MCPサーバーは追加の設定が必要
- 一部のサーバーは有料サービスとの連携が必要
- 初心者はまず基本機能をマスターしてから導入推奨

**💡 Tips**: まずはGitHubやNotionなど、普段使っているツールから試してみましょう。

## 🚀 さらなる学習へ

### 次のステップ

1. **より複雑なプロジェクトに挑戦**
   - フルスタックアプリケーション
   - マイクロサービス
   - モバイルアプリ

2. **MCPサーバーの活用**
   - 開発ツールの統合
   - カスタムMCPサーバーの作成

3. **カスタムエージェントの作成**
   - プロジェクト固有の自動化

4. **コミュニティへの参加**
   - Cursor Discord
   - GitHub Discussions

## 🏆 完了おめでとうございます！

これで、CursorでAIペアプログラミングを学ぶ全カリキュラムが完了しました。
あなたは今、AIと効果的に協働できるプログラマーです！

---

### 最終チェックリスト

- [ ] 効果的なプロンプトが書ける
- [ ] トラブルを自力で解決できる
- [ ] .cursorrulesを最適化できる
- [ ] チーム開発で活用できる
- [ ] 6-10倍の開発速度を実現できる

**Congratulations on becoming a Cursor Master! 🎊**