# ESLint設定

プロジェクトで使用しているESLintの詳細な設定について説明します。

## 目次

1. [基本設定](#基本設定)
2. [使用しているプラグイン](#使用しているプラグイン)
3. [TypeScript関連ルール](#typescript関連ルール)
4. [関数スタイルルール](#関数スタイルルール)
5. [コードフォーマットルール](#コードフォーマットルール)
6. [UIコンポーネント用の例外設定](#uiコンポーネント用の例外設定)

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

### 3. eslint-plugin-storybook

Storybook公式のESLint設定を使用しています。これにより、Storybookのストーリーファイル（`*.stories.tsx`）に対する適切なLintルールが適用されます。

```javascript
...storybook.configs["flat/recommended"]
```

詳細は[Storybook ESLint Plugin](https://github.com/storybookjs/eslint-plugin-storybook)を参照してください。

---

## TypeScript関連ルール

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

### 2. 未使用変数のチェック

```javascript
"@typescript-eslint/no-unused-vars": [
  "error",
  {
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "^_"
  }
]
```

#### 設定の意図

使用されていない変数を検出します。ただし、アンダースコア（`_`）で始まる変数は意図的に未使用であることを示すため、エラーから除外します。

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

### 3. Promiseの誤用防止

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
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to save');
    }

    return response.json();
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
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

### 4. 厳格なboolean式

```javascript
"@typescript-eslint/strict-boolean-expressions": [
  "error",
  {
    "allowNullableObject": true,
    "allowNullableString": true
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

## 関数スタイルルール

### 1. コールバック関数でアロー関数を強制

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

### 2. 関数宣言を禁止し、関数式を強制

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

## コードフォーマットルール

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

## UIコンポーネント用の例外設定

```javascript
{
  files: ["src/components/ui/**/*.{ts,tsx}", "src/components/layout/**/*.{ts,tsx}"],
  rules: {
    "func-style": "off",
  },
}
```

### 設定の意図

UIコンポーネント（`src/components/ui/`、`src/components/layout/`）では、関数宣言の使用を許可します。これはshadcn/uiなどの外部コンポーネントライブラリとの互換性を保つためです。

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

## 関連リンク

- [Prettier設定](./02-prettier.md) - コードフォーマットの詳細
- [Stylelint設定](./03-stylelint.md) - CSSのLint設定
- [コマンド・IDE統合](./04-commands-ide.md) - 実行方法とIDE設定
- [TypeScript ESLint](https://typescript-eslint.io/) - 公式ドキュメント
