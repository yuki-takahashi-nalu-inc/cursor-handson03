# 第6章: 実践テクニックとトラブルシューティング

## 学習目標
- 効果的なプロンプトの書き方をマスター
- よくあるトラブルと解決方法を理解
- チーム開発でのCursor活用法を学ぶ

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
   - Cmd+Shift+P → "Rebuild Index"
3. モデルを変更（より軽いモデルを選択）
4. .cursorignoreファイルで大きなファイルを除外
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
```json
// .vscode/settings.json
{
  "cursor.chat.defaultPrompts": {
    "review": "コードレビューを実施してください",
    "test": "このコードのテストを作成してください",
    "refactor": "このコードをリファクタリングしてください"
  }
}
```

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

## 6.6 よくある質問（FAQ）

### Q: Cursorの無料版と有料版の違いは？

**A:** 
- 無料版：基本機能は利用可能、使用回数に制限
- Pro版：無制限の使用、高速なモデル、優先サポート

### Q: VSCodeの拡張機能は使える？

**A:** 
はい、CursorはVSCodeのフォークなので、ほとんどの拡張機能が使用可能です。

### Q: オフラインでも使える？

**A:** 
基本的なエディタ機能は使えますが、AI機能にはインターネット接続が必要です。

### Q: 機密コードでも安全？

**A:**
- ローカルモードあり
- .cursorignoreで除外可能
- エンタープライズ版でより高いセキュリティ

## 📝 この章で学んだこと

- ✅ 効果的なプロンプトの書き方
- ✅ トラブルシューティング方法
- ✅ .cursorrulesの最適化
- ✅ チーム開発での活用法
- ✅ 生産性向上のTips

## 🎉 Cursorマスター認定

### あなたは今、以下ができるようになりました：

1. **基本操作マスター**
   - Tab補完、Cmd+K、Cmd+L、Cmd+I を使いこなせる

2. **効率的な開発**
   - AIと協働して6-10倍の開発速度を実現

3. **高品質なコード**
   - AIレビューで品質を担保

4. **問題解決能力**
   - エラーやトラブルを自力で解決

5. **チーム開発**
   - Cursorを使ったコラボレーション

## 🚀 さらなる学習へ

### 次のステップ

1. **より複雑なプロジェクトに挑戦**
   - フルスタックアプリケーション
   - マイクロサービス
   - モバイルアプリ

2. **カスタムエージェントの作成**
   - プロジェクト固有の自動化

3. **コミュニティへの参加**
   - Cursor Discord
   - GitHub Discussions

## 🏆 完了おめでとうございます！

これで、Cursorを使いこなすための全カリキュラムが完了しました。
あなたは今、AIペアプログラミングのエキスパートです！

---

### 最終チェックリスト

- [ ] 効果的なプロンプトが書ける
- [ ] トラブルを自力で解決できる
- [ ] .cursorrulesを最適化できる
- [ ] チーム開発で活用できる
- [ ] 6-10倍の開発速度を実現できる

**Congratulations on becoming a Cursor Master! 🎊**