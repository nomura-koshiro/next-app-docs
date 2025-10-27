# コーディング規約

本ドキュメントでは、プロジェクト全体で守るべきコーディング規約、リーダブルコードの原則、Next.js開発のベストプラクティスについて説明します。型安全性の確保、単一責任の原則、そしてESLint/Prettierの設定を含む包括的なガイドラインを提供します。

## 📚 目次

### 基本原則と設計

1. **[基本原則](./01-basic-principles.md)**
   - 型安全性の確保
   - 単一責任の原則
   - typeのみ使用（interface禁止）

2. **[設計原則](./02-design-principles.md)**
   - SOLID原則（単一責任、開放閉鎖、リスコフの置換、インターフェース分離、依存性逆転）
   - DRY原則（Don't Repeat Yourself）
   - KISS原則（Keep It Simple, Stupid）
   - YAGNI原則（You Aren't Gonna Need It）

3. **[リーダブルコード原則](./03-readable-code.md)**
   - 第1章: 理解しやすいコード
   - 第2章: 名前に情報を詰め込む
   - 第3章: 誤解されない名前
   - 第4章: 美しさ
   - 第5章: コメントすべきことを知る
   - 第6章: コメントは正確で簡潔に
   - 第7章: 制御フローを読みやすく
   - 第8章: 巨大な式を分割
   - 第9章: 変数と読みやすさ
   - 第10章: 無関係の下位問題を抽出
   - 第11章: 一度に1つのことを
   - 第12章: コードに思いを込める
   - 第13章: 短いコードを書く
   - 第14章: テストと読みやすさ

### Next.js・TypeScript・React

1. **[Next.js開発ベストプラクティス](./04-nextjs-best-practices.md)**
   - Server ComponentとClient Componentの使い分け
   - データフェッチングの最適化
   - キャッシュ戦略の適切な使用
   - ルーティングとナビゲーション
   - 画像最適化
   - メタデータとSEO
   - エラーハンドリング
   - 環境変数の適切な使用
   - パフォーマンス最適化
   - 型安全性の確保

2. **[命名規則](./05-naming-conventions.md)**
   - コンポーネント、フック、ストア、API、型定義、定数の命名規則
   - boolean変数・関数の命名パターン

3. **[TypeScript規約](./06-typescript-rules.md)**
   - エクスポート関数の型明示
   - Nullish coalescing演算子
   - Optional Chaining
   - Type Guards

4. **[React/Next.js規約](./07-react-nextjs-rules.md)**
   - Reactのimportは不要
   - Props型定義
   - Server/Client Components

### ツール設定

1. **[ツール設定](./08-tools-setup.md)**
   - ESLint主要ルール
   - Prettier設定
   - コマンド一覧
   - VSCode設定
   - 必要な拡張機能

---

## 🚀 クイックリファレンス

### よく使うコマンド

```bash
# コード品質チェック
pnpm check              # すべてのチェック
pnpm check:fix          # すべてのチェックと自動修正

# 個別実行
pnpm lint               # ESLintチェック
pnpm lint:fix           # ESLint自動修正
pnpm format             # Prettierで整形
```

### 基本ルール

```typescript
// ✅ typeを使用（interfaceは禁止）
type User = {
  id: string;
  name: string;
};

// ✅ アロー関数を使用
export const fetchUser = async (id: string): Promise<User> => {
  return await api.get<User>(`/users/${id}`);
};

// ✅ return文の前に空行
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return total;
};

// ✅ Server Component（デフォルト）
export const UserList = async () => {
  const users = await fetchUsers();

  return <div>{users.map(user => <div key={user.id}>{user.name}</div>)}</div>;
};

// ✅ Client Component（必要な場合のみ）
'use client';

export const UserForm = () => {
  const [data, setData] = useState<FormData>();

  return <form>...</form>;
};
```

---

## 💡 ヒント

### コミット前のチェックリスト

1. `pnpm check:fix` でコード品質をチェック・修正
2. `pnpm build` でビルドが通ることを確認
3. コードレビューで指摘を受けやすいポイントを確認
   - `any`型を使っていないか
   - `interface`を使っていないか
   - return文の前に空行があるか
   - Server/Client Componentを適切に使い分けているか

### 迷った時は

- **型定義:** typeを使う（interfaceは禁止）
- **関数:** アロー関数を使う
- **コンポーネント:** デフォルトはServer Component
- **命名:** kebab-caseでファイル、PascalCaseで型

---

## 🔗 関連リンク

### 内部ドキュメント

- [リンター・フォーマッター](../02-linter-formatter/)
- [コンポーネント設計](../03-component-design/)
- [フォームとバリデーション](../04-forms-validation/)
- [API統合](../05-api-integration/)

### 外部リソース

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [リーダブルコード](https://www.oreilly.co.jp/books/9784873115658/)

---

**次のステップ:** [基本原則](./01-basic-principles.md) から始めましょう
