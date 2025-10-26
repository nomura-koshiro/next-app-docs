# カスタムフックとReact 19の新機能

このセクションでは、プロジェクトで使用するカスタムフックの実装パターンとReact 19の新機能について、**2つの学び方**を提供します。

---

## 📘 段階的に学ぶ（learning/）

**こんな人におすすめ:**

- カスタムフックを初めて学ぶ
- 体系的に理解したい
- 基礎から丁寧に学びたい

### 学習の流れ

1. **[イントロダクション](./learning/01-introduction.md)**
   カスタムフックの役割、このドキュメントの使い方、前提知識

2. **[基礎編：カスタムフックの基本](./learning/02-basics.md)**
   基本パターン、命名規則、簡単な実装例（UI状態管理）

3. **[実践編1：フォーム管理](./learning/03-forms.md)**
   React Hook Form、バリデーション、実装例（ログイン、作成）

4. **[実践編2：データ管理](./learning/04-data.md)**
   TanStack Query、CRUD操作、実装例（一覧、編集、削除）

5. **[実践編3：フォームとデータの統合](./learning/05-integration.md)**
   送信→遷移→キャッシュ更新の流れ、実装例

6. **[発展編：React 19の新機能](./learning/06-react19.md)**
   useOptimistic、useTransition、use の詳細と実装例

7. **[統合編：高度なパターン](./learning/07-advanced-patterns.md)**
   複数フックの組み合わせ、パフォーマンス最適化

8. **[リファレンス](./learning/08-reference.md)**
   チートシート、ベストプラクティス、FAQ、トラブルシューティング

---

## 🎯 ユースケースから探す（guides/）

**こんな人におすすめ:**

- すぐに実装したい
- 特定の機能の実装方法を知りたい
- サンプルコードが欲しい

### クイックスタート

- **[🎯 React 19機能の使い分けガイド](./guides/01-decision-guide/)** - **まずここから！** どのフックをいつ使うべきか
- **[概要・判断フロー](./guides/02-overview/)** - どのフックを使うべき？
- **[基本パターン](./guides/03-patterns/)** - 実装規約とコーディングスタイル

### ユースケース別ガイド

実装したい機能から直接該当ページを開けます：

1. **[認証（ログイン・ログアウト）](./guides/04-use-cases/01-authentication.md)**
   ログインフォーム、認証状態管理、リダイレクト

2. **[CRUD操作（作成・更新・削除）](./guides/04-use-cases/02-crud-operations.md)**
   ユーザー作成、編集、削除、一覧表示

3. **[リアルタイム更新（チャット）](./guides/04-use-cases/03-realtime-updates.md)**
   チャット機能、楽観的UI更新、リアルタイムメッセージ

4. **[検索・フィルタリング](./guides/04-use-cases/04-search-filter.md)**
   検索ボックス、フィルター、ノンブロッキングな検索

5. **[ファイルアップロード](./guides/04-use-cases/05-file-operations.md)**
   ファイル選択、アップロード進捗、エラーハンドリング

### 高度なトピック

- **[React 19の活用](./guides/05-react19-features/)** - useOptimistic、useTransition、use の詳細
- **[ベストプラクティス](./guides/06-best-practices/)** - エラーハンドリング、パフォーマンス、テスト
- **[リファレンス](./guides/07-reference/)** - チートシート、よくある質問

---

## どちらから始めるべき？

### 📘 学習型（learning/）を選ぶ場合

- カスタムフックが初めて
- React Hook FormやTanStack Queryをまだ使ったことがない
- 体系的に理解してから実装したい
- 時間をかけて丁寧に学びたい

**→ [イントロダクションから始める](./learning/01-introduction.md)**

### 🎯 ガイド型（guides/）を選ぶ場合

- カスタムフックの基本は理解している
- すぐに実装を始めたい
- 特定の機能（ログイン、CRUD等）を作りたい
- サンプルコードをベースにカスタマイズしたい

**→ [React 19機能の使い分けガイドから始める](./guides/01-decision-guide/)**

---

## 参考リソース

### カスタムフック

- [React公式 - カスタムフックの作成](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)

### React 19の新機能

- [React 19公式ブログ](https://react.dev/blog/2025/01/09/react-19)
- [useOptimistic API リファレンス](https://react.dev/reference/react/useOptimistic)
- [useTransition API リファレンス](https://react.dev/reference/react/useTransition)
- [use フック API リファレンス](https://react.dev/reference/react/use)

### プロジェクト固有のドキュメント

- [React/Next.js規約](../01-coding-standards/07-react-nextjs-rules.md)
- [フォームとバリデーション](../06-forms-validation/index.md)
- [API統合](../07-api-integration/index.md)
