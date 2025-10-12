# Linter・Formatter設定

本ドキュメントでは、プロジェクトで使用しているESLint、Prettier、Stylelintの設定について詳しく説明します。各ルールの意図、良い例と悪い例、そしてなぜそのルールが必要なのかを解説します。

## 目次

1. [ESLint設定](#eslint設定)
   - [基本設定](#基本設定)
   - [使用しているプラグイン](#使用しているプラグイン)
   - [TypeScript関連ルール](#typescript関連ルール)
   - [関数スタイルルール](#関数スタイルルール)
   - [コードフォーマットルール](#コードフォーマットルール)
   - [UIコンポーネント用の例外設定](#uiコンポーネント用の例外設定)
2. [Prettier設定](#prettier設定)
3. [Stylelint設定](#stylelint設定)
   - [Tailwind CSS対応](#tailwind-css対応)
   - [スタイリスティックルール](#スタイリスティックルール)
   - [論理プロパティ](#論理プロパティ)
   - [CSS品質ルール](#css品質ルール)

---

## ESLint設定

### 基本設定

```javascript
const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")
```

#### 継承している設定

- **`next/core-web-vitals`**: Next.jsのCore Web Vitalsに関するルールセット
- **`next/typescript`**: Next.js用のTypeScriptルールセット

これらの設定により、Next.jsアプリケーションの最適化とパフォーマンス向上が自動的にサポートされます。

---

### 使用しているプラグイン

このプロジェクトでは、以下のESLintプラグインを使用しています。

```javascript
import tanstackQuery from "@tanstack/eslint-plugin-query";
// import tailwindcss from "eslint-plugin-tailwindcss"; // Tailwind CSS v4と互換性がないため一時的にコメントアウト
import storybook from "eslint-plugin-storybook";
```

#### 1. @tanstack/eslint-plugin-query

TanStack Query（React Query）のベストプラクティスをチェックするプラグインです。

**検出できる問題:**

- ❌ **useEffectでのデータ取得**: TanStack Queryを使うべき場面でuseEffectを使用している
- ❌ **不適切なqueryKey**: クエリキーの設計が不適切で、キャッシュが正しく機能しない
- ❌ **無限ループの可能性**: 依存配列の設定ミスによる無限ループ
- ❌ **staleTimeの未設定**: データが即座に古くなり、不要な再取得が発生

**Bad例（検出されるアンチパターン）:**

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

**Good例（推奨される方法）:**

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

**設定:**

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

**なぜこのプラグインが重要なのか:**

1. **パフォーマンス**: 不要なデータ取得を防ぎ、適切なキャッシュ戦略を推進
2. **バグ予防**: useEffectの誤用による無限ループやメモリリークを防止
3. **ベストプラクティス**: TanStack Queryの推奨パターンに従ったコード

---

#### 2. eslint-plugin-tailwindcss（現在無効）

⚠️ **注意**: Tailwind CSS v4との互換性問題があるため、現在このプラグインはコメントアウトしています。

**理由:**

`eslint-plugin-tailwindcss`はTailwind CSS v3用に設計されており、v4では内部APIが変更されているため動作しません。

```javascript
// Tailwind CSS v4と互換性がないため一時的にコメントアウト
// import tailwindcss from "eslint-plugin-tailwindcss";
```

**本来の機能（v4対応版がリリースされたら有効化予定）:**

- Tailwindクラス名の順序統一
- 矛盾するクラスの検出（例: `mx-4 ml-2`）
- 未使用のクラスの検出
- 非推奨のクラスの警告

**将来的な対応:**

Tailwind CSS v4対応版の`eslint-plugin-tailwindcss`がリリースされたら、設定を有効化します。

---

#### 無視するファイル/ディレクトリ

```javascript
ignores: [
  "node_modules/**",
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
]
```

#### なぜこれらを無視するのか

- **node_modules**: サードパーティライブラリは自分たちのプロジェクトのルールに従う必要がない
- **.next, out, build**: ビルド成果物はLintの対象外（自動生成されたコード）
- **next-env.d.ts**: Next.jsが自動生成する型定義ファイル

---

### TypeScript関連ルール

#### 1. 型定義の一貫性（type優先）

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

#### 2. 未使用変数のチェック

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

#### 改善方法

```typescript
// Before: 未使用変数がある
const processData = (data: string[], options: ProcessOptions) => {
  const timestamp = Date.now(); // 使用されていない

  return data.map((item) => item.toUpperCase());
};

// After 1: 不要な変数を削除
const processData = (data: string[], _options: ProcessOptions) => {
  return data.map((item) => item.toUpperCase());
};

// After 2: 実際に使用する
const processData = (data: string[], options: ProcessOptions) => {
  const timestamp = Date.now();

  return data.map((item) => ({
    value: item.toUpperCase(),
    processedAt: timestamp,
    debug: options.debug,
  }));
};
```

---

#### 3. Promiseの誤用防止

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

#### 4. 厳格なboolean式

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

#### 改善方法

```typescript
// Before: 暗黙的な型変換に依存
const processItems = (items: Item[]) => {
  if (items) { // 常にtrue
    return items.map(process);
  }

  return [];
};

// After: 明示的なチェック
const processItems = (items: Item[]) => {
  if (items.length > 0) {
    return items.map(process);
  }

  return [];
};

// Before: 数値のチェックが不明確
const renderCount = (count: number) => {
  if (count) { // 0の場合false
    return <span>{count}</span>;
  }

  return null;
};

// After: 意図を明確に
const renderCount = (count: number) => {
  if (count > 0) {
    return <span>{count}</span>;
  }

  return null;
};
```

---

### 関数スタイルルール

#### 1. コールバック関数でアロー関数を強制

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

#### 改善方法

```typescript
// Before
const userIds = users.map(function (user) {
  return user.id;
});

// After
const userIds = users.map((user) => user.id);

// Before: thisのバインドが必要
class Component {
  items = [1, 2, 3];

  process() {
    return this.items.map(function (item) {
      return item * 2;
    }.bind(this)); // bindが必要
  }
}

// After: アロー関数は自動的にthisを継承
class Component {
  items = [1, 2, 3];

  process() {
    return this.items.map((item) => item * 2); // bindが不要
  }
}
```

---

#### 2. 関数宣言を禁止し、関数式を強制

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

#### 改善方法

```typescript
// Before: 関数宣言（巻き上げされる）
console.log(add(1, 2)); // エラーにならない（巻き上げのため）

function add(a: number, b: number) {
  return a + b;
}

// After: アロー関数式（巻き上げされない）
const add = (a: number, b: number) => a + b;

console.log(add(1, 2)); // これは正常に動作

// Before: 関数の再代入が可能
function greet(name: string) {
  return `Hello, ${name}`;
}

greet = () => 'Overridden'; // 可能だが望ましくない

// After: constで再代入を防止
const greet = (name: string) => `Hello, ${name}`;

greet = () => 'Overridden'; // エラー：constは再代入不可
```

---

### コードフォーマットルール

#### return文の前に空行を強制

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

#### 改善方法

```typescript
// Before: 詰まっていて読みにくい
const createUserProfile = (user: User) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const displayName = fullName.length > 20 ? `${fullName.slice(0, 17)}...` : fullName;
  const profileUrl = `/users/${user.id}`;
  return { fullName, displayName, profileUrl };
};

// After: 空行で見やすく
const createUserProfile = (user: User) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const displayName = fullName.length > 20 ? `${fullName.slice(0, 17)}...` : fullName;
  const profileUrl = `/users/${user.id}`;

  return { fullName, displayName, profileUrl };
};
```

---

### UIコンポーネント用の例外設定

```javascript
{
  files: ["src/components/ui/**/*.{ts,tsx}", "src/components/layout/**/*.{ts,tsx}"],
  rules: {
    "func-style": "off",
  },
}
```

#### 設定の意図

UIコンポーネント（`src/components/ui/`、`src/components/layout/`）では、関数宣言の使用を許可します。これはshadcn/uiなどの外部コンポーネントライブラリとの互換性を保つためです。

#### なぜUIコンポーネントで例外を設けるのか

1. **shadcn/uiとの互換性**: shadcn/uiのコンポーネントは関数宣言で書かれている
2. **React.forwardRefとの相性**: 関数宣言の方が型定義がシンプルになる場合がある
3. **displayNameの自動設定**: 関数宣言は自動的にdisplayNameが設定される

#### UIコンポーネントでの使用例

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

#### UIコンポーネント以外では厳密に

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

### Storybook設定

```javascript
...storybook.configs["flat/recommended"]
```

このプロジェクトでは、Storybook公式のESLint設定を使用しています。これにより、Storybookのストーリーファイル（`*.stories.tsx`）に対する適切なLintルールが適用されます。

詳細は[Storybook ESLint Plugin](https://github.com/storybookjs/eslint-plugin-storybook)を参照してください。

---

## Prettier設定

Prettierはコードフォーマッターとして、一貫したコードスタイルを自動的に適用します。

### 基本設定

```javascript
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'auto',
};
```

### 各設定の詳細

#### 1. セミコロンの使用

```javascript
semi: true
```

#### 設定の効果

ステートメントの末尾に常にセミコロンを追加します。

#### ❌ `semi: false` の場合

```typescript
const user = getUser()
const name = user.name
console.log(name)
```

#### ✅ `semi: true` の場合

```typescript
const user = getUser();
const name = user.name;
console.log(name);
```

#### なぜセミコロンを使用するのか

1. **明示性**: ステートメントの終わりが明確
2. **ASI（自動セミコロン挿入）の問題回避**: セミコロン省略時の予期しない動作を防ぐ
3. **TypeScriptの慣習**: TypeScriptコミュニティではセミコロン使用が一般的

---

#### 2. 末尾カンマ

```javascript
trailingComma: 'es5'
```

#### 設定の効果

ES5で有効な箇所（オブジェクト、配列など）に末尾カンマを追加します。関数の引数には追加しません。

#### ✅ 有効な箇所

```typescript
// オブジェクト
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com', // 末尾カンマ
};

// 配列
const numbers = [
  1,
  2,
  3, // 末尾カンマ
];

// import文
import {
  useState,
  useEffect,
  useCallback, // 末尾カンマ
} from 'react';
```

#### ❌ 追加されない箇所

```typescript
// 関数の引数（ES5では無効）
const sum = (
  a: number,
  b: number // 末尾カンマなし
) => a + b;
```

#### なぜES5スタイルの末尾カンマなのか

1. **差分の明瞭性**: 新しい行を追加した時の差分が1行だけになる
2. **バージョン管理**: gitの差分が読みやすくなる
3. **互換性**: 古いブラウザでも安全（関数引数には追加しない）

#### 差分の例

```diff
// 末尾カンマなしの場合
const config = {
  apiUrl: 'https://api.example.com',
- timeout: 3000
+ timeout: 3000,
+ retries: 3
};

// 末尾カンマありの場合
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 3000,
+ retries: 3
};
```

---

#### 3. クォートのスタイル

```javascript
singleQuote: true
```

#### 設定の効果

文字列にシングルクォートを使用します。

#### ❌ `singleQuote: false` の場合

```typescript
const message = "Hello, world!";
const greeting = "こんにちは";
```

#### ✅ `singleQuote: true` の場合

```typescript
const message = 'Hello, world!';
const greeting = 'こんにちは';
```

#### 例外：JSX

```tsx
// JSXの属性ではダブルクォートを使用（Prettier標準）
const Component = () => {
  return <div className="container" data-testid="main">Content</div>;
};
```

#### なぜシングルクォートなのか

1. **視覚的なノイズ削減**: シングルクォートの方が目立たない
2. **JavaScript慣習**: JavaScriptコミュニティではシングルクォートが主流
3. **タイプ数**: シフトキーが不要（一部のキーボード配列）

---

#### 4. 1行の最大文字数

```javascript
printWidth: 140
```

#### 設定の効果

1行が140文字を超える場合、自動的に改行します。

#### Before（長い行）

```typescript
const result = await fetchUserData(userId).then((data) => processUserData(data)).then((processed) => validateData(processed)).catch((error) => handleError(error));
```

#### After（140文字で改行）

```typescript
const result = await fetchUserData(userId)
  .then((data) => processUserData(data))
  .then((processed) => validateData(processed))
  .catch((error) => handleError(error));
```

#### なぜ140文字なのか

1. **可読性**: 横スクロールなしで読める（フルHD以上のモニター）
2. **コードレビュー**: GitHubなどのレビュー画面でも読みやすい
3. **バランス**: 80文字（従来の標準）では短すぎ、無制限では長すぎる

---

#### 5. インデント幅

```javascript
tabWidth: 2
```

#### 設定の効果

インデントは2スペースで統一します。

#### ✅ 2スペースインデント

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Failed');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

#### なぜ2スペースなのか

1. **JavaScript/TypeScript慣習**: 2スペースがデファクトスタンダード
2. **ネストの深さ**: Reactコンポーネントなどでネストが深くなる場合も読みやすい
3. **画面の有効活用**: 4スペースより横幅を取らない

---

#### 6. タブ文字の使用

```javascript
useTabs: false
```

#### 設定の効果

タブ文字ではなくスペースを使用します。

#### なぜスペースなのか

1. **一貫性**: すべてのエディタで同じ見た目になる
2. **差分の明確性**: スペースの方がgit diffで見やすい
3. **Web標準**: Webフロントエンドではスペースが一般的

---

#### 7. アロー関数の引数の括弧

```javascript
arrowParens: 'always'
```

#### 設定の効果

アロー関数の引数が1つでも常に括弧で囲みます。

#### ❌ `arrowParens: 'avoid'` の場合

```typescript
const double = n => n * 2;
const greet = name => `Hello, ${name}`;
```

#### ✅ `arrowParens: 'always'` の場合

```typescript
const double = (n) => n * 2;
const greet = (name) => `Hello, ${name}`;
```

#### なぜ常に括弧を使用するのか

1. **一貫性**: 引数の数が変わっても書き方が変わらない
2. **型注釈**: TypeScriptで型を追加する際に括弧が必要
3. **可読性**: 引数であることが明確

#### 引数追加時の差分

```diff
// 括弧なしの場合
- const greet = name => `Hello, ${name}`;
+ const greet = (name, age) => `Hello, ${name}, ${age}`;

// 括弧ありの場合
- const greet = (name) => `Hello, ${name}`;
+ const greet = (name, age) => `Hello, ${name}, ${age}`;
```

---

#### 8. 改行コード

```javascript
endOfLine: 'auto'
```

#### 設定の効果

既存ファイルの改行コードを維持します。新規ファイルはOSのデフォルトを使用します。

#### なぜautoなのか

1. **クロスプラットフォーム**: Windows（CRLF）とUnix（LF）の両方に対応
2. **Gitとの連携**: `.gitattributes`でline ending設定がある場合はそちらを優先
3. **柔軟性**: チーム開発で異なるOSを使用していても問題なし

---

## Stylelint設定

Stylelintは、CSSの品質とスタイルをチェックするツールです。このプロジェクトでは、Tailwind CSS v4に最適化された設定を使用しています。

### 使用プラグイン

```javascript
plugins: ['@stylistic/stylelint-plugin', 'stylelint-plugin-logical-css']
```

- **@stylistic/stylelint-plugin**: コードスタイル（インデント、スペースなど）のルール
- **stylelint-plugin-logical-css**: 論理プロパティ（start/end）の推奨

---

### Tailwind CSS対応

#### @ルールの許可

```javascript
'at-rule-no-unknown': [
  true,
  {
    ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', 'theme'],
  },
]
```

#### 設定の意図

Tailwind CSS特有の@ルールをエラーにしないようにします。

#### ✅ 許可される@ルール

```css
/* Tailwind CSSのディレクティブ */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムユーティリティの定義 */
@layer components {
  .btn-primary {
    @apply rounded-lg bg-blue-500 px-4 py-2 font-bold text-white;
  }
}

/* テーマ設定 */
@theme {
  --color-primary: #3b82f6;
  --font-sans: 'Inter', sans-serif;
}

/* 設定 */
@config './tailwind.config.js';
```

#### なぜこれらを許可するのか

Tailwind CSS v4では、これらの@ルールがフレームワークの中核機能です。標準CSSにはないため、明示的に許可する必要があります。

---

### スタイリスティックルール

#### 1. インデント

```javascript
'@stylistic/indentation': 2
```

#### ✅ 正しいインデント（2スペース）

```css
.container {
  display: flex;
  flex-direction: column;
}

@layer components {
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
  }
}
```

---

#### 2. クォートのスタイル

```javascript
'@stylistic/string-quotes': 'double'
```

#### ❌ シングルクォート

```css
.background {
  background-image: url('/images/bg.jpg');
  font-family: 'Inter', sans-serif;
}
```

#### ✅ ダブルクォート

```css
.background {
  background-image: url("/images/bg.jpg");
  font-family: "Inter", sans-serif;
}
```

#### なぜダブルクォートなのか

1. **HTML/JSXとの一貫性**: HTML属性やJSXではダブルクォートが標準
2. **CSS慣習**: CSSではダブルクォートが一般的
3. **視覚的な区別**: JavaScriptとCSSで異なるクォートを使用することで区別しやすい

---

#### 3. カラーコードの小文字化

```javascript
'@stylistic/color-hex-case': 'lower'
```

#### ❌ 大文字

```css
.text {
  color: #FF5733;
  background-color: #FFFFFF;
}
```

#### ✅ 小文字

```css
.text {
  color: #ff5733;
  background-color: #ffffff;
}
```

#### なぜ小文字なのか

1. **一貫性**: すべてのカラーコードが統一される
2. **可読性**: 小文字の方が読みやすい（主観的だが一般的な意見）
3. **短縮形**: 小文字の方が短縮形（`#fff`など）との違いが少ない

---

#### 4. コロンの前後のスペース

```javascript
'@stylistic/declaration-colon-space-after': 'always',
'@stylistic/declaration-colon-space-before': 'never',
```

#### ❌ 間違ったスペース

```css
.element {
  color : red; /* beforeにスペース */
  margin:1rem; /* afterにスペースなし */
  padding :  2rem; /* 両方間違い */
}
```

#### ✅ 正しいスペース

```css
.element {
  color: red;
  margin: 1rem;
  padding: 2rem;
}
```

---

#### 5. ブロックの開始括弧の前のスペース

```javascript
'@stylistic/block-opening-brace-space-before': 'always'
```

#### ❌ スペースなし

```css
.container{
  display: flex;
}

.card{
  padding: 1rem;
}
```

#### ✅ スペースあり

```css
.container {
  display: flex;
}

.card {
  padding: 1rem;
}
```

---

#### 6. ブロックの閉じ括弧の後の改行

```javascript
'@stylistic/block-closing-brace-newline-after': 'always'
```

#### ❌ 改行なし

```css
.card { padding: 1rem; } .button { margin: 0.5rem; }
```

#### ✅ 改行あり

```css
.card {
  padding: 1rem;
}

.button {
  margin: 0.5rem;
}
```

---

### 論理プロパティ

```javascript
'plugin/use-logical-properties-and-values': [
  true,
  {
    severity: 'warning',
  },
]
```

#### 設定の意図

物理的なプロパティ（left/right）ではなく、論理的なプロパティ（start/end）の使用を推奨します（警告レベル）。

#### ❌ 物理的なプロパティ（警告）

```css
.element {
  margin-left: 1rem; /* 警告：margin-inline-startを使用すべき */
  padding-right: 2rem; /* 警告：padding-inline-endを使用すべき */
  border-left: 1px solid black; /* 警告 */
}
```

#### ✅ 論理プロパティ

```css
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
  border-inline-start: 1px solid black;
}
```

#### なぜ論理プロパティなのか

1. **国際化**: RTL（右から左）言語でも正しく動作
2. **保守性**: レイアウト方向が変わっても修正不要
3. **モダンな標準**: CSS Logical Propertiesは現代のWeb標準

#### 方向の対応表

| 物理プロパティ        | 論理プロパティ         | 意味           |
| --------------------- | ---------------------- | -------------- |
| `margin-left`         | `margin-inline-start`  | 行内方向の開始 |
| `margin-right`        | `margin-inline-end`    | 行内方向の終了 |
| `margin-top`          | `margin-block-start`   | ブロック方向の開始 |
| `margin-bottom`       | `margin-block-end`     | ブロック方向の終了 |
| `padding-left`        | `padding-inline-start` | 行内方向の開始 |
| `border-left`         | `border-inline-start`  | 行内方向の開始 |
| `text-align: left`    | `text-align: start`    | 開始揃え |

#### 実際の効果

```css
/* 物理プロパティ */
.nav-item {
  margin-left: 1rem; /* LTR: 左、RTL: そのまま左（問題！） */
}

/* 論理プロパティ */
.nav-item {
  margin-inline-start: 1rem; /* LTR: 左、RTL: 自動的に右 */
}
```

---

### カスタムプロパティの命名規則

```javascript
'custom-property-pattern': [
  '^(color|font|spacing|size|shadow)-[a-z0-9-]+$|^radius$',
  {
    message: 'カスタムプロパティは "color-", "font-", "spacing-", "size-", "shadow-" で始めるか、"radius" である必要があります',
  },
]
```

#### 設定の意図

CSS変数の命名を統一し、shadcn/uiのデザインシステムに準拠します。

#### ❌ 規則に違反する命名

```css
:root {
  --primary: #3b82f6; /* エラー：プレフィックスがない */
  --main-background: #ffffff; /* エラー：許可されていないプレフィックス */
  --buttonColor: #000000; /* エラー：キャメルケース */
}
```

#### ✅ 正しい命名

```css
:root {
  /* カラー変数 */
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-foreground: #000000;

  /* フォント変数 */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* スペーシング変数 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* サイズ変数 */
  --size-button-height: 2.5rem;
  --size-input-width: 20rem;

  /* シャドウ変数 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 特別な変数 */
  --radius: 0.5rem;
}
```

#### なぜこの命名規則なのか

1. **shadcn/ui互換性**: shadcn/uiのデザインシステムと一貫性を保つ
2. **カテゴリ別**: プレフィックスにより変数の用途が一目でわかる
3. **保守性**: 関連する変数をグループ化しやすい

---

### CSS品質ルール

#### 1. 重複セレクタの禁止

```javascript
'no-duplicate-selectors': true
```

#### ❌ 重複セレクタ

```css
.button {
  padding: 0.5rem 1rem;
  background: blue;
}

/* ... 他のCSS ... */

.button {
  /* エラー：重複 */
  font-size: 1rem;
}
```

#### ✅ セレクタを統合

```css
.button {
  padding: 0.5rem 1rem;
  background: blue;
  font-size: 1rem;
}
```

---

#### 2. 空のブロックの禁止

```javascript
'block-no-empty': true
```

#### ❌ 空のブロック

```css
.container {
  /* エラー：空のブロック */
}

.wrapper {
}
```

#### ✅ プロパティを含める、または削除

```css
.container {
  display: flex;
}

/* 不要な場合は削除 */
```

---

#### 3. 無効な16進数カラーの禁止

```javascript
'color-no-invalid-hex': true
```

#### ❌ 無効なカラーコード

```css
.text {
  color: #gg0000; /* エラー：ggは16進数ではない */
  background: #12345; /* エラー：5桁は無効 */
}
```

#### ✅ 有効なカラーコード

```css
.text {
  color: #ff0000;
  background: #123456;
}
```

---

#### 4. ショートハンドプロパティの推奨

```javascript
'declaration-block-no-redundant-longhand-properties': true
```

#### ❌ 冗長な個別プロパティ

```css
.box {
  margin-top: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
}
```

#### ✅ ショートハンド

```css
.box {
  margin: 1rem;
}
```

---

#### 5. フォント関連

```javascript
'font-family-no-duplicate-names': true,
'font-family-name-quotes': 'always-where-recommended'
```

#### ❌ 問題のあるフォント指定

```css
.text {
  font-family: Arial, Arial, sans-serif; /* エラー：重複 */
  font-family: Times New Roman, serif; /* 警告：スペースを含むのでクォートが必要 */
}
```

#### ✅ 正しいフォント指定

```css
.text {
  font-family: Arial, sans-serif;
  font-family: "Times New Roman", serif;
}
```

---

#### 6. calc関数

```javascript
'function-calc-no-unspaced-operator': true
```

#### ❌ スペースのない演算子

```css
.element {
  width: calc(100%-2rem); /* エラー */
  height: calc(50vh+10px); /* エラー */
}
```

#### ✅ 演算子の前後にスペース

```css
.element {
  width: calc(100% - 2rem);
  height: calc(50vh + 10px);
}
```

---

#### 7. セレクタの検証

```javascript
'selector-pseudo-class-no-unknown': true,
'selector-pseudo-element-no-unknown': true,
'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }]
```

#### ❌ 未知のセレクタ

```css
/* 未知の擬似クラス */
.element:hoverr {
  /* エラー：hoverのタイプミス */
}

/* 未知の擬似要素 */
.element::afterr {
  /* エラー：afterのタイプミス */
}

/* 未知の要素 */
unknownelement {
  /* エラー：存在しない要素 */
}
```

#### ✅ 正しいセレクタ

```css
.element:hover {
  color: blue;
}

.element::after {
  content: "";
}

/* カスタム要素は許可される */
my-custom-element {
  display: block;
}
```

---

#### 8. 重複プロパティの制限

```javascript
'declaration-block-no-duplicate-properties': [
  true,
  {
    ignore: ['consecutive-duplicates-with-different-values'],
  },
]
```

#### ❌ 重複プロパティ（エラー）

```css
.element {
  color: red;
  font-size: 1rem;
  color: blue; /* エラー：重複 */
}
```

#### ✅ 許可される重複（フォールバック）

```css
.element {
  /* フォールバック値（古いブラウザ用） */
  background: red;
  background: linear-gradient(to right, red, blue); /* 許可される */
}

.grid {
  /* フォールバック */
  display: block;
  display: grid; /* 許可される */
}
```

---

## まとめ

### コマンド

```bash
# すべてのLintチェック
pnpm lint

# ESLintのみ
pnpm lint:eslint

# Prettierチェック
pnpm lint:prettier

# Stylelintのみ
pnpm lint:stylelint

# 自動修正
pnpm lint:fix
```

### 設定ファイルの場所

- **ESLint**: `eslint.config.mjs`
- **Prettier**: `.prettierrc.config.mjs`
- **Stylelint**: `stylelint.config.mjs`

### 使用中のESLintプラグイン

このプロジェクトでは、以下のESLintプラグインを使用しています：

#### ✅ 有効なプラグイン

- **`@tanstack/eslint-plugin-query`**: TanStack Queryのベストプラクティスチェック
  - useEffectでのデータ取得を検出
  - 不適切なqueryKeyを警告
  - 無限ループの可能性を検出

- **`eslint-plugin-storybook`**: Storybookストーリーファイルの品質チェック
  - ストーリーの命名規則
  - メタデータの検証
  - ベストプラクティスの推進

- **`eslint-config-next`に含まれるプラグイン**:
  - `@next/eslint-plugin-next`: Next.js専用ルール
  - `eslint-plugin-react`: React
  - `eslint-plugin-react-hooks`: React Hooks
  - `eslint-plugin-jsx-a11y`: アクセシビリティ
  - `eslint-plugin-import`: import文の管理

#### ⚠️ 一時的に無効なプラグイン

- **`eslint-plugin-tailwindcss`**: Tailwind CSS v4との互換性問題のため無効化
  - v4対応版がリリースされたら有効化予定

### IDEとの連携

#### VS Code

推奨拡張機能：

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

`.vscode/settings.json`で自動フォーマットを有効化：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  }
}
```

### 設定変更時の注意点

1. **ESLint設定を変更する場合**
   - 必ず`pnpm lint`を実行して、既存コードへの影響を確認
   - UIコンポーネント用の例外設定を考慮

2. **Prettier設定を変更する場合**
   - プロジェクト全体に影響するため、チーム全体で合意を得る
   - `pnpm format`で全ファイルを再フォーマット

3. **Stylelint設定を変更する場合**
   - Tailwind CSSとの互換性を確認
   - カスタムプロパティの命名規則はshadcn/uiとの整合性を保つ
