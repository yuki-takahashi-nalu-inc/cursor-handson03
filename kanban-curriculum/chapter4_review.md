# 第4章: AIコードレビューで品質向上

## 学習目標
- CursorのAIコードレビュー機能を体験する
- AIにコード品質の問題を検出してもらう
- AIと協働してパフォーマンスとセキュリティを改善する

## 進め方

### 必須課題（4.1〜4.4）
基本的なAIコードレビュー機能を習得します：
- **4.1 AIコードレビューの基本**: レビュー機能の使い方を学ぶ
- **4.2 プロジェクト全体のレビュー**: 包括的なコードチェック
- **4.3 パフォーマンス最適化**: 実行速度とメモリ効率の改善
- **4.4 セキュリティレビュー**: 脆弱性の検出と修正

### オプション課題（4.5〜4.8）
さらに高度な品質改善に挑戦したい方向け：
- **4.5 アクセシビリティレビュー**: WCAG準拠のチェック
- **4.6 コード品質メトリクス**: 複雑度や重複の分析
- **4.7 自動修正の実行**: 一括改善の実施
- **4.8 継続的な品質改善**: .cursorrulesの更新

必須課題を完了後、時間があればオプション課題にも挑戦してみましょう。

## 4.1 AIコードレビューの基本

### レビューの依頼方法
- **チャット（Ask）**: プロジェクト全体や特定ファイルのレビュー
- **インライン（Cmd+K）**: 選択範囲の改善提案
- **Agent**: 複数ファイルの包括的レビュー

### レビューの観点
1. コード品質
2. パフォーマンス
3. セキュリティ
4. アクセシビリティ
5. ベストプラクティス

## 4.2 プロジェクト全体のレビュー

### ハンズオン課題1: 包括的なコードレビュー

**チャット（Ask）で以下を入力：**

```
@src フォルダ全体のコードレビューをしてください。

以下の観点でチェック：
1. TypeScriptの型安全性
2. React最適化（不要な再レンダリング）
3. エラーハンドリング
4. コードの重複
5. 命名規則の一貫性

問題点と改善案を提示してください。
```

**期待されるレビュー結果の例：**

> **コードレビュー結果**
> 
> **🔴 重要な問題**
> 
> 1. **型安全性**: 
>    - `any`型が3箇所で使用されています
>    - 修正例：
> 
> ```typescript
> // Before
> const handleDrop = (e: any) => {...}
> 
> // After
> const handleDrop = (e: DropResult) => {...}
> ```
> 
> 2. **再レンダリング**:
>    - KanbanCardでpropsの比較が不十分
>    - React.memoに比較関数を追加
> 
> **🟡 改善推奨**
> 
> 1. エラーハンドリングが不足
> 2. console.logが残っている（3箇所）

## 4.3 パフォーマンス最適化

### ハンズオン課題2: パフォーマンスレビュー

**チャット（Ask）で依頼：**

```
@src/components @src/hooks

パフォーマンスの観点でレビューしてください：

1. メモ化の機会（React.memo、useMemo、useCallback）
2. 大量データでの動作
3. バンドルサイズへの影響
4. レンダリング最適化

具体的な改善コードを提供してください。
```

**生成される最適化コード例：**

```tsx
// 最適化前
export function KanbanCard({ card, onDelete }) {
  return <div onClick={() => onDelete(card.id)}>...</div>
}

// 最適化後
export const KanbanCard = memo(
  function KanbanCard({ card, onDelete }) {
    const handleDelete = useCallback(() => {
      onDelete(card.id)
    }, [card.id, onDelete])
    
    return <div onClick={handleDelete}>...</div>
  },
  (prevProps, nextProps) => {
    return prevProps.card.id === nextProps.card.id &&
           prevProps.card.updatedAt === nextProps.card.updatedAt
  }
)
```

## 4.4 セキュリティレビュー

### ハンズオン課題3: セキュリティ脆弱性のチェック

**チャット（Ask）で依頼：**

```
@src フォルダのセキュリティレビューを実施してください：

1. XSS脆弱性のチェック
2. 入力値のサニタイゼーション
3. ローカルストレージの安全性
4. 依存関係の脆弱性

問題点と修正案を提示してください。
```

**検出される問題と修正例：**

```tsx
// 脆弱性あり
<div dangerouslySetInnerHTML={{ __html: card.description }} />

// 修正後
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(card.description) 
}} />
```

## 4.5 アクセシビリティレビュー（オプション）

### ハンズオン課題4: a11yの改善

**チャット（Ask）で依頼：**

```
アクセシビリティの観点でレビューしてください：

1. キーボード操作
2. スクリーンリーダー対応
3. ARIA属性
4. フォーカス管理
5. カラーコントラスト

WCAG 2.1 Level AAに準拠させてください。
```

**改善提案の例：**

```tsx
// アクセシビリティ改善
<div 
  role="button"
  tabIndex={0}
  aria-label={`Delete card: ${card.title}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDelete()
    }
  }}
>
  <Trash2 aria-hidden="true" />
</div>
```

## 4.6 コード品質メトリクス（オプション）

### ハンズオン課題5: 品質指標の測定

**チャット（Ask）で依頼：**

```
@src フォルダのコード品質メトリクスを分析してください：

1. 循環的複雑度
2. コードの重複
3. 関数の長さ
4. ファイルの長さ
5. 依存関係の複雑さ

改善が必要な箇所を特定し、リファクタリング案を提示してください。
```

## 4.7 自動修正の実行（オプション）

### ハンズオン課題6: 一括改善

**Agentで実行：**

```
レビューで発見された問題を自動修正してください：

1. すべてのany型を適切な型に置換
2. console.logを削除
3. 未使用のインポートを削除
4. ESLintエラーを修正
5. Prettierでフォーマット

修正後、変更内容をレポートしてください。
```

**Agentの実行結果：**
```
✅ 修正完了:
- any型を5箇所で修正
- console.log 3箇所削除
- 未使用インポート 8箇所削除
- ESLintエラー 12件修正
- 全ファイルをフォーマット

変更ファイル数: 15
```

## 4.8 継続的な品質改善（オプション）

### ハンズオン課題7: .cursorrulesの更新

**チャット（Ask）で依頼：**

```
今回のレビュー結果を基に、.cursorrulesファイルを更新してください。

今後のコード生成で同じ問題が起きないように、以下を追加：
1. 型安全性のルール
2. パフォーマンスのベストプラクティス
3. アクセシビリティ要件
4. コーディング規約
```

**更新される.cursorrulesの例：**

```text
# Kanban Board Project Rules

## Type Safety
- No any types allowed
- Strict TypeScript mode
- All functions must have return types
- Props interfaces required

## Performance
- Use React.memo for all components
- useCallback for event handlers
- useMemo for expensive computations
- Lazy load heavy components

## Accessibility
- All interactive elements must be keyboard accessible
- ARIA labels required
- Focus management
- WCAG 2.1 AA compliance

## Code Quality
- No console.log in production
- Max function length: 50 lines
- Max file length: 200 lines
- DRY principle
```

## 📝 この章でAIと協働して実現したこと

- ✅ AIコードレビュー機能の活用体験
- ✅ AIによる多角的な品質チェック
- ✅ AIによる自動修正の実行
- ✅ AIを活用したパフォーマンス最適化
- ✅ AIと協働したセキュリティとアクセシビリティの改善

## 💡 効果的なレビューのコツ

### レビュー依頼のポイント

1. **具体的な観点を指定**
```
「メモリリークの可能性をチェック」
「React 18のベストプラクティスに準拠」
```

2. **優先順位を明確に**
```
「重要度順：セキュリティ > パフォーマンス > 可読性」
```

3. **期待する出力形式**
```
「問題点と修正コードを併記してください」
```

### 段階的な改善

1. まず重大な問題を修正
2. パフォーマンスの最適化
3. コードスタイルの統一
4. ドキュメントの追加

## 🎯 チャレンジ課題

AIレビューを活用して：

1. Lighthouse スコア100点を目指す
2. TypeScript strictモード完全対応
3. 0 ESLintエラー達成
4. バンドルサイズを500KB以下に最適化
5. React Developer Toolsで不要な再レンダリングを0に

## 🚀 次の章へ

第5章では、AIペアプログラミングの実践的なテクニックとトラブルシューティングを学びます。

---

### 課題チェックリスト

- [ ] プロジェクト全体のレビュー実施
- [ ] パフォーマンス最適化の適用
- [ ] セキュリティ脆弱性の修正
- [ ] アクセシビリティの改善
- [ ] 自動修正の実行
- [ ] .cursorrulesの更新