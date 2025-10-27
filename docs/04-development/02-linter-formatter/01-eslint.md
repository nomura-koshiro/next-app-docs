# ESLint設定

プロジェクトで使用しているESLintの詳細な設定について説明します。

## 目次

1. [基本設定](#基本設定)
2. [使用しているプラグイン](#使用しているプラグイン)
3. [TypeScript - 型と型安全性](#typescript-型と型安全性)
4. [TypeScript - 非同期処理とPromise](#typescript-非同期処理とpromise)
5. [コードスタイル - 関数](#コードスタイル-関数)
6. [コードスタイル - フォーマット](#コードスタイル-フォーマット)
7. [コードスタイル - インポート/エクスポート](#コードスタイル-インポートエクスポート)
8. [ファイル別の例外設定](#ファイル別の例外設定)

---

## 基本設定

```javascript
const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")
```

### 継承している設定

- **`next/core-web-vitals`**: Next.jsのCore Web Vitalsに関するルールセット
- **`next/typescript`**: Next.js用のTypeScriptルールセット

これらの設定により、Next.jsアプリケーションの最適化とパフォーマンス向上が自動的にサポートされます。

### 無視するファイル/ディレクトリ

```javascript
ignores: [
  "node_modules/**",
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
]
```

**なぜこれらを無視するのか:**

- **node_modules**: サードパーティライブラリは自分たちのプロジェクトのルールに従う必要がない
- **.next, out, build**: ビルド成果物はLintの対象外（自動生成されたコード）
- **next-env.d.ts**: Next.jsが自動生成する型定義ファイル

---

## 使用しているプラグイン

このプロジェクトでは、以下のESLintプラグインを使用しています。

```javascript
import tanstackQuery from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
// import tailwindcss from "eslint-plugin-tailwindcss"; // Tailwind CSS v4と互換性がないため一時的にコメントアウト
import storybook from "eslint-plugin-storybook";
```

### 1. @tanstack/eslint-plugin-query

TanStack Query（React Query）のベストプラクティスをチェックするプラグインです。

#### 検出できる問題

- ❌ **useEffectでのデータ取得**: TanStack Queryを使うべき場面でuseEffectを使用している
- ❌ **不適切なqueryKey**: クエリキーの設計が不適切で、キャッシュが正しく機能しない
- ❌ **無限ループの可能性**: 依存配列の設定ミスによる無限ループ
- ❌ **staleTimeの未設定**: データが即座に古くなり、不要な再取得が発生

#### Bad例（検出されるアンチパターン）

```typescript
// ❌ useEffectでデータ取得（TanStack Queryを使うべき）
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return <div>{/* ... */}</div>;
};

// ❌ 不適切なqueryKey（毎回新しいオブジェクトを作成）
const { data } = useQuery({
  queryKey: ['users', { filter: new Date() }], // 毎回新しいDate
  queryFn: getUsers,
});
```

#### Good例（推奨される方法）

```typescript
// ✅ TanStack Queryを使用
const UserList = () => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <LoadingSpinner />;

  return <div>{/* ... */}</div>;
};

// ✅ 安定したqueryKey
const { data } = useQuery({
  queryKey: ['users'], // 安定したキー
  queryFn: getUsers,
  staleTime: 1000 * 60, // 1分間キャッシュ
});
```

#### 設定

```javascript
...tanstackQuery.configs["flat/recommended"],

// カスタムルール
{
  files: ["**/*.{ts,tsx}"],
  rules: {
    "@tanstack/query/exhaustive-deps": "warn", // 依存配列のチェック（警告レベル）
  },
}
```

#### なぜこのプラグインが重要なのか

1. **パフォーマンス**: 不要なデータ取得を防ぎ、適切なキャッシュ戦略を推進
2. **バグ予防**: useEffectの誤用による無限ループやメモリリークを防止
3. **ベストプラクティス**: TanStack Queryの推奨パターンに従ったコード

---

### 2. eslint-plugin-tailwindcss（現在無効）

⚠️ **注意**: Tailwind CSS v4との互換性問題があるため、現在このプラグインはコメントアウトしています。

#### 理由

`eslint-plugin-tailwindcss`はTailwind CSS v3用に設計されており、v4では内部APIが変更されているため動作しません。

```javascript
// Tailwind CSS v4と互換性がないため一時的にコメントアウト
// import tailwindcss from "eslint-plugin-tailwindcss";
```

#### 本来の機能（v4対応版がリリースされたら有効化予定）

- Tailwindクラス名の順序統一
- 矛盾するクラスの検出（例: `mx-4 ml-2`）
- 未使用のクラスの検出
- 非推奨のクラスの警告

#### 将来的な対応

Tailwind CSS v4対応版の`eslint-plugin-tailwindcss`がリリースされたら、設定を有効化します。

---

### 3. eslint-plugin-simple-import-sort

インポート文とエクスポート文を自動的にソートするプラグインです。

#### 設定

```javascript
plugins: {
  "simple-import-sort": simpleImportSort,
},
rules: {
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",
}
```

#### ルール

- `simple-import-sort/imports`: "error" - インポートを自動的にソート
- `simple-import-sort/exports`: "error" - エクスポートを自動的にソート

#### ❌ 悪い例

```typescript
// ソートされていない、グループ化されていない
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
```

#### ✅ 良い例

```typescript
// アルファベット順、グループ化されている
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
```

#### なぜインポートのソートが重要なのか

1. **一貫性**: すべてのファイルで同じインポート順序を保つ
2. **可読性**: グループ化されたインポートは依存関係が明確
3. **マージコンフリクトの削減**: ソート済みなので競合が起きにくい
4. **メンテナンス性**: インポートの追加・削除が容易

---

### 4. eslint-plugin-unused-imports

未使用のインポートと変数を検出・削除するプラグインです。

#### 設定

```javascript
plugins: {
  "unused-imports": unusedImports,
},
rules: {
  "@typescript-eslint/no-unused-vars": "off", // このプラグインを使用するため無効化
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "error",
    {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }
  ],
}
```

#### ルール

- `unused-imports/no-unused-imports`: "error" - 未使用のimportをエラーとして検出
- `unused-imports/no-unused-vars`: "error" - 未使用の変数をエラーとして検出（`_`プレフィックスは除外）

#### ❌ 悪い例

```typescript
// 未使用のインポート
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';

// useEffectとuseMemoは使われていない
const MyComponent = () => {
  const [count, setCount] = useState(0);

  return <div>{count}</div>;
};
```

#### ✅ 良い例

```typescript
// 使用しているインポートのみ
import { useState } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  return <div>{count}</div>;
};

// 意図的に未使用の変数には_プレフィックス
const handleClick = (_event: MouseEvent) => {
  console.log('Clicked');
};
```

#### なぜ未使用インポートの削除が重要なのか

1. **バンドルサイズ**: 未使用のインポートはバンドルサイズを増加させる
2. **コードの明瞭性**: 実際に使用されているものだけが残る
3. **保守性**: 削除し忘れたコードがないことを保証
4. **パフォーマンス**: 不要なモジュールの読み込みを防ぐ

---

### 5. eslint-plugin-storybook

Storybook公式のESLint設定を使用しています。これにより、Storybookのストーリーファイル（`*.stories.tsx`）に対する適切なLintルールが適用されます。

```javascript
...storybook.configs["flat/recommended"]
```

詳細は[Storybook ESLint Plugin](https://github.com/storybookjs/eslint-plugin-storybook)を参照してください。

---

## TypeScript - 型と型安全性

### 1. 型定義の一貫性（type優先）

```javascript
"@typescript-eslint/consistent-type-definitions": ["error", "type"]
```

#### 設定の意図

interfaceではなくtypeを使用することを強制します。

#### ❌ 悪い例

```typescript
// interfaceの使用（エラー）
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  data: unknown;
  error: string | null;
}
```

#### ✅ 良い例

```typescript
// typeの使用
type UserProfile = {
  id: number;
  name: string;
  email: string;
};

type ApiResponse = {
  data: unknown;
  error: string | null;
};
```

#### なぜtypeを推奨するのか

1. **一貫性**: プロジェクト全体で統一されたスタイル
2. **柔軟性**: typeはユニオン型、交差型など、より多くの型表現が可能
3. **明確性**: interfaceの宣言マージ機能は予期しない動作を引き起こす可能性がある

#### 改善方法

既存のinterfaceをtypeに置き換える：

```typescript
// Before
interface Props {
  title: string;
}

// After
type Props = {
  title: string;
};
```

---

### 2. 未使用変数とインポートのチェック（eslint-plugin-unused-importsで管理）

```javascript
"@typescript-eslint/no-unused-vars": "off", // unused-importsプラグインを使用
"unused-imports/no-unused-imports": "error",
"unused-imports/no-unused-vars": [
  "error",
  {
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "^_"
  }
]
```

#### 設定の意図

使用されていない変数とインポートを検出します。ただし、アンダースコア（`_`）で始まる変数は意図的に未使用であることを示すため、エラーから除外します。

**注意**: このルールは`@typescript-eslint/no-unused-vars`の代わりに`eslint-plugin-unused-imports`で管理されています。これにより、未使用のインポートも同時に検出・削除できます。

#### ❌ 悪い例

```typescript
// 未使用の変数（エラー）
const fetchUser = (userId: number) => {
  const apiKey = 'secret-key'; // 使用されていない
  const endpoint = '/api/users';

  return fetch(`${endpoint}/${userId}`);
};

// 未使用の関数引数（エラー）
const handleClick = (event: MouseEvent, metadata: Record<string, unknown>) => {
  console.log('Clicked');
  // metadataが使用されていない
};
```

#### ✅ 良い例

```typescript
// すべての変数が使用されている
const fetchUser = (userId: number) => {
  const endpoint = '/api/users';

  return fetch(`${endpoint}/${userId}`);
};

// 未使用だが意図的に無視する引数には_プレフィックスを使用
const handleClick = (_event: MouseEvent, _metadata: Record<string, unknown>) => {
  console.log('Clicked');
};

// または、必要な引数のみを定義
const handleClick = () => {
  console.log('Clicked');
};
```

#### なぜ未使用変数を禁止するのか

1. **コードの明瞭性**: 不要なコードは読み手を混乱させる
2. **保守性**: 削除し忘れたコードが残っていることを示す可能性がある
3. **バンドルサイズ**: 未使用のインポートなどは最終的なバンドルサイズに影響する

---

### 3. 命名規則の強制 (@typescript-eslint/naming-convention)

```javascript
"@typescript-eslint/naming-convention": [
  "error",
  // ... 詳細な設定
]
```

#### 設定の意図

変数、関数、型など、すべての識別子に対して一貫した命名規則を強制します。

#### 主要なルール

| 対象 | 形式 | 例 |
|------|------|-----|
| **デフォルト** | camelCase | `userName`, `fetchData` |
| **変数** | camelCase または PascalCase | `userName`, `UserComponent` |
| **const変数** | camelCase, PascalCase, UPPER_CASE | `apiUrl`, `UserList`, `API_KEY` |
| **関数** | camelCase または PascalCase | `getUserName`, `UserList` |
| **パラメータ** | camelCase | `userId`, `_unusedParam` |
| **Type/Interface** | PascalCase | `UserProfile`, `ApiResponse` |
| **Enum** | PascalCase | `UserRole`, `HttpStatus` |
| **Enumメンバー** | UPPER_CASE | `ADMIN`, `NOT_FOUND` |
| **クラス** | PascalCase | `UserService`, `ApiClient` |
| **インポート** | camelCase, PascalCase, UPPER_CASE | `useState`, `Button`, `API_URL` |
| **オブジェクトプロパティ** | 制限なし | `user_id`, `firstName` (API対応) |

#### ❌ 悪い例

```typescript
// 変数がsnake_case（エラー）
const user_name = 'John';

// 関数がsnake_case（エラー）
const get_user_data = () => { ... };

// 型がcamelCase（エラー）
type userProfile = {
  id: number;
  name: string;
};

// Enumがsnake_case（エラー）
enum user_role {
  ADMIN = 'admin',
  USER = 'user',
}

// EnumメンバーがcamelCase（エラー）
enum UserRole {
  admin = 'admin',
  user = 'user',
}
```

#### ✅ 良い例

```typescript
// 変数: camelCase または PascalCase
const userName = 'John';
const UserComponent = () => <div>User</div>;

// const変数: camelCase, PascalCase, UPPER_CASE
const apiUrl = '/api/users';
const UserList = ['John', 'Jane'];
const API_KEY = 'secret-key';

// 関数: camelCase または PascalCase
const getUserData = () => { ... };
const UserProfile = () => <div>Profile</div>;

// 型: PascalCase
type UserProfile = {
  id: number;
  name: string;
};

// Enum: PascalCase、メンバー: UPPER_CASE
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// 未使用パラメータ: _プレフィックス
const handleClick = (_event: MouseEvent) => {
  console.log('Clicked');
};

// オブジェクトプロパティ: 制限なし（API対応）
const apiResponse = {
  user_id: 1,
  first_name: 'John',
  created_at: '2024-01-01',
};
```

#### 特別な設定

1. **Leading underscore**: 許可（未使用変数の明示用）
2. **Trailing underscore**: 禁止
3. **オブジェクトプロパティと型プロパティ**: 制限なし（外部API対応）

#### なぜ命名規則が重要なのか

1. **一貫性**: プロジェクト全体で統一されたコードスタイル
2. **可読性**: 識別子の種類が名前から判別できる
3. **保守性**: チーム全体で同じルールに従う
4. **TypeScript連携**: 型とランタイム値の区別が明確

---

## TypeScript - 非同期処理とPromise

### 1. Promiseの誤用防止

```javascript
"@typescript-eslint/no-misused-promises": [
  "error",
  {
    "checksVoidReturn": false
  }
]
```

#### 設定の意図

Promiseを正しく扱うことを強制します。`checksVoidReturn: false`により、voidを返す場所でのPromiseの使用を許可します（React Server Actionsなどで必要）。

#### ❌ 悪い例

```typescript
// 条件式でPromiseを直接使用（常にtruthyになる）
const checkUser = async (userId: number) => {
  return fetch(`/api/users/${userId}`).then((res) => res.json());
};

if (checkUser(1)) { // エラー：Promiseは常にtruthy
  console.log('User exists');
}

// Promiseをtry-catchなしで使用
const saveData = (data: unknown) => {
  fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data),
  }); // エラー処理がない
};
```

#### ✅ 良い例

```typescript
// awaitを使用してPromiseを解決
const checkUser = async (userId: number) => {
  const response = await fetch(`/api/users/${userId}`);

  return response.json();
};

const validateUser = async () => {
  const user = await checkUser(1);
  if (user) {
    console.log('User exists');
  }
};

// エラーハンドリングを含める
const saveData = async (data: unknown) => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to save');
      }

      return response.json();
    })
    .catch((error) => {
      console.error('Save error:', error);
      throw error;
    })
};

// React Server Actionsでの使用（checksVoidReturn: falseにより許可）
const MyForm = () => {
  const handleSubmit = async (formData: FormData) => {
    'use server';
    // Server Actionの実装
  };

  return <form action={handleSubmit}>...</form>;
};
```

#### なぜPromiseの誤用を防ぐのか

1. **予期しない動作**: Promise自体は常にtruthyなため、条件分岐で直接使用すると意図しない結果になる
2. **エラーハンドリング**: 未処理のPromise rejectionはアプリケーションクラッシュの原因になる
3. **コードの意図**: awaitを使用することで、非同期処理の流れが明確になる

---

### 2. floating Promiseの禁止

```javascript
"@typescript-eslint/no-floating-promises": "error"
```

#### 設定の意図

Promise型の値を`await`せずに放置することを禁止します。これにより、エラーハンドリングの漏れや意図しない非同期処理を防ぎます。

#### ❌ 悪い例

```typescript
// awaitがない（エラー）
const handleClick = () => {
  createUser(data); // Promiseが返されるがawaitされていない
};

// 非同期関数の結果を無視
const saveAndRedirect = () => {
  saveData(); // Promiseを返すが処理されていない
  router.push('/success');
};

// イベントハンドラで未処理のPromise
<button onClick={() => deleteUser(userId)}>削除</button>
```

#### ✅ 良い例

```typescript
// awaitを使用
const handleClick = async () => {
  await createUser(data);
};

// .catch()でエラーハンドリング
const handleClick = () => {
  createUser(data).catch(error => {
    console.error(error);
  });
};

// void演算子で意図的に無視（非推奨だが許可される）
const handleClick = () => {
  void createUser(data);
};

// 適切なエラーハンドリング
const saveAndRedirect = async () => {
  await saveData().catch(error => {
    console.error('Save failed:', error);

    return;
  });
  router.push('/success');
};
```

#### なぜfloating promiseを禁止するのか

1. **エラーハンドリング**: 未処理のPromise rejectionはアプリケーションクラッシュの原因
2. **予期しない動作**: 非同期処理の完了を待たずに次の処理が実行される
3. **デバッグの困難さ**: エラーが発生してもキャッチされない

#### 例外設定

Storybookファイル（`**/*.stories.{ts,tsx}`）では、このルールはオフになっています。詳しくは[ファイル別の特別なルール設定](#ファイル別の特別なルール設定)を参照してください。

---

### 3. エラーハンドリング: try-catch禁止 (no-restricted-syntax)

**重要**: このプロジェクトでは try-catch 文の使用を禁止し、`.catch()` メソッドの使用を強制しています。

```javascript
"no-restricted-syntax": [
  "error",
  {
    "selector": "TryStatement",
    "message": "try-catchは禁止されています。代わりに.catch()メソッドを使用してください。例: await somePromise().catch(error => { ... })"
  }
]
```

#### 設定の意図

Promiseベースの非同期処理では、`try-catch`ではなく`.catch()`メソッドを使用することを強制します。これにより、エラーハンドリングの一貫性を保ち、Promiseチェーンの利点を活かします。

#### ❌ 悪い例

```typescript
// try-catchを使用（エラー）
const fetchUser = async (id: number) => {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
};

// 複数のtry-catchネスト（エラー）
const processData = async () => {
  try {
    const users = await fetchUsers();
    try {
      const validated = await validateUsers(users);

      return validated;
    } catch (validationError) {
      console.error(validationError);
    }
  } catch (error) {
    console.error(error);
  }
};
```

#### ✅ 良い例

```typescript
// .catch()メソッドを使用
const fetchUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`).catch((error) => {
    console.error('Fetch failed:', error);
    throw error;
  });

  const data = await response.json().catch((error) => {
    console.error('JSON parse failed:', error);
    throw error;
  });

  return data;
};

// Promiseチェーンでのエラーハンドリング
const processData = async () => {
  return await fetchUsers()
    .then(validateUsers)
    .catch((error) => {
      console.error('Processing failed:', error);
      throw error;
    });
};

// 複数の処理を一つの.catch()でハンドリング
const saveUserData = async (data: UserData) => {
  await Promise.all([
    saveToDatabase(data),
    sendNotification(data),
    updateCache(data),
  ]).catch((error) => {
    console.error('Save operation failed:', error);
    throw error;
  });
};
```

#### なぜtry-catchを禁止するのか

1. **一貫性**: Promiseベースの処理では`.catch()`が自然
2. **可読性**: Promiseチェーンが明確になる
3. **メンテナンス性**: エラーハンドリングの場所が統一される
4. **型安全性**: `.catch()`の方がTypeScriptの型推論と相性が良い

#### 例外設定

以下のファイルでは try-catch の使用が許可されます：

- API Client (`src/lib/api-client.ts`)
- エラーハンドリングユーティリティ (`src/utils/error-handling.ts`)
- API関連ファイル (`src/features/**/api/**/*.{ts,tsx}`)
- ストア関連ファイル (`src/features/**/stores/**/*.{ts,tsx}`)

詳しくは[ファイル別の例外設定](#ファイル別の例外設定)を参照してください。

#### 関連ドキュメント

詳細なエラーハンドリング規約については、[エラーハンドリング規約](../01-coding-standards/09-error-handling-rules.md)を参照してください。

---

### 4. 厳格なboolean式

```javascript
"@typescript-eslint/strict-boolean-expressions": [
  "error",
  {
    "allowNullableObject": true,
    "allowNullableString": true,
    "allowNullableBoolean": true
  }
]
```

#### 設定の意図

条件式で真偽値として評価される値を厳密にチェックします。ただし、null許容のオブジェクトと文字列は許可します。

#### ❌ 悪い例

```typescript
// 数値を直接条件式で使用
const count = 0;
if (count) { // エラー：数値を直接boolean評価
  console.log('Has items');
}

// 配列を直接条件式で使用
const items: string[] = [];
if (items) { // エラー：配列は常にtruthy
  console.log('Has items');
}

// 空配列チェックの誤り
const users: User[] = [];
if (users) { // エラー：空配列でもtruthyになる
  console.log(`Found ${users.length} users`);
}
```

#### ✅ 良い例

```typescript
// 明示的な比較
const count = 0;
if (count > 0) {
  console.log('Has items');
}

// 配列の長さをチェック
const items: string[] = [];
if (items.length > 0) {
  console.log('Has items');
}

// null/undefinedチェック（allowNullableObjectにより許可）
const user: User | null = getUser();
if (user) { // 許可される
  console.log(user.name);
}

// 文字列チェック（allowNullableStringにより許可）
const message: string | undefined = getMessage();
if (message) { // 許可される
  console.log(message);
}

// 明示的なboolean値
const isValid: boolean = true;
if (isValid) { // 正しい：boolean型
  console.log('Valid');
}
```

#### なぜ厳格なboolean式が必要なのか

1. **バグの防止**: 暗黙的な型変換によるバグを防ぐ（例：0はfalsy、[]はtruthy）
2. **意図の明確化**: コードの意図が明確になる（長さのチェック vs 存在のチェック）
3. **型安全性**: TypeScriptの型システムを最大限に活用

---

## コードスタイル - 関数

### 1. 関数宣言を禁止し、関数式を強制

```javascript
"func-style": ["error", "expression", { "allowArrowFunctions": true }]
```

#### 設定の意図

関数宣言（`function name() {}`）を禁止し、関数式（特にアロー関数）の使用を強制します。

#### ❌ 悪い例

```typescript
// 関数宣言（エラー）
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 関数宣言（エラー）
function formatDate(date: Date) {
  return date.toISOString();
}

// 通常のコンポーネントでの関数宣言（エラー）
function UserList({ users }: Props) {
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

#### ✅ 良い例

```typescript
// アロー関数式（推奨）
const calculateTotal = (items: Item[]) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// 簡潔なアロー関数
const formatDate = (date: Date) => date.toISOString();

// Reactコンポーネントもアロー関数
const UserList = ({ users }: Props) => {
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
};

// constでの関数式
const fetchUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);

  return response.json();
};
```

#### なぜ関数式を推奨するのか

1. **巻き上げの回避**: 関数宣言は巻き上げられるため、定義前に呼び出せてしまう（予期しない動作の原因）
2. **一貫性**: 変数宣言と同じくconst/letを使用
3. **再代入防止**: constで宣言することで、関数の再代入を防ぐ
4. **モダンなスタイル**: アロー関数はES6以降の標準

---

### 2. コールバック関数でアロー関数を強制

```javascript
"prefer-arrow-callback": ["error", { "allowNamedFunctions": false }]
```

#### 設定の意図

コールバック関数では常にアロー関数を使用することを強制します。

#### ❌ 悪い例

```typescript
// 通常の関数式をコールバックとして使用
const numbers = [1, 2, 3];
const doubled = numbers.map(function (num) {
  return num * 2;
});

// 名前付き関数式
const filtered = numbers.filter(function isEven(num) {
  return num % 2 === 0;
});

// イベントハンドラで関数式を使用
button.addEventListener('click', function handleClick(event) {
  console.log(event);
});
```

#### ✅ 良い例

```typescript
// アロー関数を使用
const numbers = [1, 2, 3];
const doubled = numbers.map((num) => num * 2);

// 複数行の場合もアロー関数
const filtered = numbers.filter((num) => {
  return num % 2 === 0;
});

// イベントハンドラでもアロー関数
button.addEventListener('click', (event) => {
  console.log(event);
});

// 非同期コールバック
fetchData().then((data) => {
  console.log(data);
});
```

#### なぜアロー関数を推奨するのか

1. **簡潔性**: より短く読みやすいコード
2. **thisの挙動**: アロー関数は外側のthisを継承（バインドの必要がない）
3. **一貫性**: モダンなJavaScript/TypeScriptの標準的なスタイル

---

## コードスタイル - フォーマット

### return文の前に空行を強制

```javascript
"padding-line-between-statements": [
  "error",
  {
    "blankLine": "always",
    "prev": "*",
    "next": "return"
  }
]
```

#### 設定の意図

return文の前に必ず空行を入れることで、関数の処理ロジックと戻り値を視覚的に分離します。

#### ❌ 悪い例

```typescript
// return文の前に空行がない
const calculateDiscount = (price: number, discountRate: number) => {
  const discount = price * discountRate;
  const finalPrice = price - discount;
  return finalPrice; // エラー：空行がない
};

// 複数の処理の後、空行なしでreturn
const processUser = (user: User) => {
  const validated = validateUser(user);
  const normalized = normalizeData(validated);
  const enriched = enrichUserData(normalized);
  return enriched; // エラー：空行がない
};
```

#### ✅ 良い例

```typescript
// return文の前に空行
const calculateDiscount = (price: number, discountRate: number) => {
  const discount = price * discountRate;
  const finalPrice = price - discount;

  return finalPrice;
};

// 複数の処理の後、空行を入れてreturn
const processUser = (user: User) => {
  const validated = validateUser(user);
  const normalized = normalizeData(validated);
  const enriched = enrichUserData(normalized);

  return enriched;
};

// 単一式の場合は空行不要
const double = (num: number) => num * 2;

// 早期リターンの場合
const findUser = (users: User[], id: number) => {
  if (users.length === 0) {

    return null;
  }

  const user = users.find((u) => u.id === id);

  return user ?? null;
};
```

#### なぜ空行が必要なのか

1. **可読性**: 処理ロジックと戻り値を視覚的に区別できる
2. **構造の明確化**: 関数の「実行部分」と「結果部分」を明確に分離
3. **コードレビュー**: return文が見つけやすくなる

---

## コードスタイル - インポート/エクスポート

### インポート・エクスポートの自動ソート

```javascript
"simple-import-sort/imports": "error",
"simple-import-sort/exports": "error"
```

#### 設定の意図

インポート文とエクスポート文を自動的にソートし、プロジェクト全体で一貫した順序を保ちます。

#### ソートルール

インポートは以下の順序で自動的にグループ化されます：

1. **外部ライブラリ** - `node_modules`からのインポート
2. **内部モジュール** - `@/`プレフィックス付きのインポート
3. **相対インポート** - `./`や`../`からのインポート

各グループ内ではアルファベット順にソートされます。

#### ❌ 悪い例

```typescript
// ソートされていない、グループ化されていない
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import type { User } from './types';
import { formatDate } from '../utils/format';
```

#### ✅ 良い例

```typescript
// 外部ライブラリ（アルファベット順）
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 内部モジュール（アルファベット順）
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';

// 相対インポート（アルファベット順）
import { formatDate } from '../utils/format';
import type { User } from './types';
```

#### エクスポートのソート

```typescript
// ❌ 悪い例
export { UserList } from './user-list';
export { Button } from './button';
export type { User } from './types';

// ✅ 良い例
export { Button } from './button';
export type { User } from './types';
export { UserList } from './user-list';
```

#### 自動修正

このルールは自動修正可能です。以下のコマンドで自動的にソートされます：

```bash
npm run lint:fix
```

---

## ファイル別の例外設定

### 1. UIコンポーネント用の例外設定

```javascript
{
  files: ["src/components/ui/**/*.{ts,tsx}", "src/components/sample-ui/**/*.{ts,tsx}", "src/components/layout/**/*.{ts,tsx}"],
  rules: {
    "func-style": "off",
  },
}
```

### 設定の意図

UIコンポーネント（`src/components/ui/`、`src/components/sample-ui/`、`src/components/layout/`）では、関数宣言の使用を許可します。これはshadcn/uiなどの外部コンポーネントライブラリとの互換性を保つためです。

### なぜUIコンポーネントで例外を設けるのか

1. **shadcn/uiとの互換性**: shadcn/uiのコンポーネントは関数宣言で書かれている
2. **React.forwardRefとの相性**: 関数宣言の方が型定義がシンプルになる場合がある
3. **displayNameの自動設定**: 関数宣言は自動的にdisplayNameが設定される

### UIコンポーネントでの使用例

```typescript
// src/components/ui/button/button.tsx
// 関数宣言が許可される
function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}

// React.forwardRefでの使用
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={className} {...props} />;
  }
);
Input.displayName = 'Input';

// アロー関数でも問題ない
const Label = ({ children, ...props }: LabelProps) => {
  return <label {...props}>{children}</label>;
};
```

### UIコンポーネント以外では厳密に

```typescript
// src/features/users/components/user-list.tsx
// UIコンポーネントフォルダ外では、アロー関数を使用
const UserList = ({ users }: Props) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// src/utils/format.ts
// ユーティリティ関数もアロー関数
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};
```

---

### 2. API関連とストア関連ファイルの例外

```javascript
{
  files: [
    "src/lib/api-client.ts",
    "src/utils/error-handling.ts",
    "src/features/**/api/**/*.{ts,tsx}",
    "src/features/**/stores/**/*.{ts,tsx}",
  ],
  rules: {
    "no-restricted-syntax": "off",
  },
}
```

#### 対象ファイル

- **API Client**: `src/lib/api-client.ts` - Axiosクライアントの初期化とインターセプター
- **エラーハンドリングユーティリティ**: `src/utils/error-handling.ts` - エラーハンドリング専用のユーティリティ関数
- **API関連ファイル**: `src/features/**/api/**/*.{ts,tsx}` - features内のAPI呼び出しファイル
- **ストア関連ファイル**: `src/features/**/stores/**/*.{ts,tsx}` - features内の状態管理ファイル

#### 理由

これらのファイルでは、外部APIとの通信やエラーハンドリングユーティリティの実装において、`try-catch`の使用が必要となる場合があります。

#### 使用例

```typescript
// src/lib/api-client.ts - API Client
import Axios, { AxiosError, AxiosResponse } from 'axios';

export const api = Axios.create({
  baseURL: env.API_URL,
});

// レスポンスインターセプターではtry-catchが許可される
api.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<T>): T => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const message = error.response?.data?.message ?? error.message ?? 'エラーが発生しました';
    console.error(`[APIエラー] ${message}`);

    return Promise.reject(error);
  }
);
```

```typescript
// src/utils/error-handling.ts - エラーハンドリングユーティリティ
export const handleAsync = async <T>(promise: Promise<T>): Promise<AsyncResult<T>> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    if (error instanceof Error) {
      return [null, error];
    }
    return [null, new Error(String(error))];
  }
};
```

```typescript
// src/features/sample-auth/stores/auth-store.ts - ストア
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (credentials) => {
    // ストア内でのエラーハンドリングでtry-catchが許可される
    try {
      const response = await api.post('/api/auth/login', credentials);
      set({ user: response.data });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
}));
```

### 3. Storybookファイルの例外

```javascript
{
  files: ["**/*.stories.{ts,tsx}"],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
  },
}
```

#### 対象ファイル

- **Storybookストーリー**: `*.stories.ts`, `*.stories.tsx`

#### 理由

Storybookのアクションハンドラーでは、デモ用の非同期処理でfloating promiseが問題にならないため、このルールをオフにしています。

#### 使用例

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAsyncAction: Story = {
  args: {
    children: 'Click me',
    onClick: () => {
      // Storybookではfloating promiseが許可される
      fetch('/api/action'); // awaitなしでもOK
    },
  },
};
```

### 4. TanStack Query設定

```javascript
{
  files: ["**/*.{ts,tsx}"],
  rules: {
    "@tanstack/query/exhaustive-deps": "warn",
  },
}
```

#### 理由

TanStack Queryの`exhaustive-deps`ルールは厳格すぎる場合があるため、`error`ではなく`warn`に設定しています。

#### 影響

クエリの依存配列が不完全な場合、エラーではなく警告が表示されます。警告を無視せず、適切に対応することが推奨されます。

---

## 関連リンク

- [Prettier設定](./02-prettier.md) - コードフォーマットの詳細
- [Stylelint設定](./03-stylelint.md) - CSSのLint設定
- [コマンド・IDE統合](./04-commands-ide.md) - 実行方法とIDE設定
- [エラーハンドリング規約](../01-coding-standards/09-error-handling-rules.md) - try-catch禁止の詳細
- [TypeScript ESLint](https://typescript-eslint.io/) - 公式ドキュメント
