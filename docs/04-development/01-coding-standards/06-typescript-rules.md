# TypeScript規約

TypeScript固有の規約とベストプラクティスについて説明します。

## 目次

1. [エクスポート関数は型を明示](#1-エクスポート関数は型を明示)
2. [Nullish coalescing演算子](#2-nullish-coalescing演算子)
3. [Optional Chaining](#3-optional-chaining)
4. [Type Guards](#4-type-guards)

---

## 1. エクスポート関数は型を明示

エクスポートされる関数は、引数と戻り値の型を明示的に定義します。

```typescript
// ❌ Bad: 型推論に依存
export const getUserData = (id) => {
  return users.find((u) => u.id === id);
};

// ✅ Good: 明示的な型定義
export const getUserData = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};
```

**なぜ重要か:**

- エクスポートされた関数は他のファイルから使用される
- 型が明示的だと、利用側で型推論が正確に機能する
- ドキュメントとしての役割も果たす

**例外:**

内部の private 関数は型推論に任せてもよい（ただし、明示的な型定義を推奨）

```typescript
// ✅ OK: 内部関数は型推論でも可
const formatName = (name: string) => {
  return name.trim().toLowerCase();
};

// ✅ Better: 内部関数でも型を明示
const formatName = (name: string): string => {
  return name.trim().toLowerCase();
};
```

---

## 2. Nullish coalescing演算子

`??`演算子を使用して、`null`または`undefined`の場合のデフォルト値を設定します。

```typescript
// ❌ Bad: 複雑な条件分岐
const userName = user && user.name ? user.name : 'ゲスト';

// ❌ Bad: ||演算子（0や''もfalthyとして扱われる）
const count = userCount || 10; // userCountが0の場合、10になってしまう

// ✅ Good: ??演算子
const userName = user?.name ?? 'ゲスト';
const count = userCount ?? 10; // userCountが0の場合、0のまま
```

**??と||の違い:**

- `||`: falsy値（`0`, `''`, `false`, `null`, `undefined`, `NaN`）でデフォルト値を返す
- `??`: `null`または`undefined`の場合のみデフォルト値を返す

```typescript
// 違いを明確にする例
const value1 = 0 || 10; // 10（0はfalsyなので）
const value2 = 0 ?? 10; // 0（0はnullでもundefinedでもない）

const value3 = '' || 'デフォルト'; // 'デフォルト'（''はfalsyなので）
const value4 = '' ?? 'デフォルト'; // ''（''はnullでもundefinedでもない）
```

---

## 3. Optional Chaining

`?.`演算子を使用して、ネストされたプロパティに安全にアクセスします。

```typescript
// ❌ Bad: 複数の条件チェック
const city = user && user.address && user.address.city;

// ❌ Bad: ネストした条件分岐
let city;
if (user) {
  if (user.address) {
    city = user.address.city;
  }
}

// ✅ Good: Optional Chaining
const city = user?.address?.city;
```

**配列要素へのアクセス:**

```typescript
// ❌ Bad
const firstUser = users && users[0] && users[0].name;

// ✅ Good
const firstUser = users?.[0]?.name;
```

**メソッド呼び出し:**

```typescript
// ❌ Bad
const result = obj && obj.method && obj.method();

// ✅ Good
const result = obj?.method?.();
```

**Optional Chaining + Nullish Coalescing:**

```typescript
// ✅ 組み合わせて使用
const userName = user?.profile?.name ?? 'ゲスト';
const userAge = user?.profile?.age ?? 0;
```

---

## 4. Type Guards

型ガードを使用して、型の絞り込みを行います。

### ユーザー定義Type Guard

```typescript
// ✅ Good: 型ガードを使用
const isUser = (value: unknown): value is User => {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
};

if (isUser(data)) {
  console.log(data.name); // 型安全
}
```

### typeof Type Guard

```typescript
// ✅ Good: typeofで型を絞り込み
const processValue = (value: string | number): string => {
  if (typeof value === 'string') {
    return value.toUpperCase(); // valueはstring型
  }

  return value.toString(); // valueはnumber型
};
```

### instanceof Type Guard

```typescript
// ✅ Good: instanceofで型を絞り込み
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message; // errorはError型
  }

  return '不明なエラー';
};
```

### in Type Guard

```typescript
type Dog = {
  bark: () => void;
};

type Cat = {
  meow: () => void;
};

// ✅ Good: inで型を絞り込み
const makeSound = (animal: Dog | Cat): void => {
  if ('bark' in animal) {
    animal.bark(); // animalはDog型
  } else {
    animal.meow(); // animalはCat型
  }
};
```

### Array.isArray Type Guard

```typescript
// ✅ Good: Array.isArrayで配列かどうか判定
const processData = (data: string | string[]): string[] => {
  if (Array.isArray(data)) {
    return data; // dataはstring[]型
  }

  return [data]; // dataはstring型
};
```

### 複合Type Guard

```typescript
type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: string;
};

// ✅ Good: 複合的な型ガード
const isSuccessResponse = <T>(response: ApiResponse<T>): response is { data: T; error?: never } => {
  return 'data' in response && response.data !== undefined;
};

const handleResponse = <T>(response: ApiResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data; // 型安全にdataにアクセス
  }

  throw new Error(response.error);
};
```

## 追加のベストプラクティス

### 1. strictモードを有効化

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true
  }
}
```

### 2. any型を避ける

```typescript
// ❌ Bad
const processData = (data: any): any => {
  return data.value;
};

// ✅ Good: unknownを使用
const processData = (data: unknown): string => {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String(data.value);
  }

  throw new Error('Invalid data');
};

// ✅ Good: ジェネリクスを使用
const processData = <T extends { value: string }>(data: T): string => {
  return data.value;
};
```

### 3. as型アサーションは最小限に

```typescript
// ❌ Bad: 不必要な型アサーション
const userName = (getUserName() as string).toUpperCase();

// ✅ Good: 型ガードを使用
const name = getUserName();
if (typeof name === 'string') {
  const userName = name.toUpperCase();
}
```

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性の確保
- [命名規則](./05-naming-conventions.md) - 型定義の命名規則
- [React/Next.js規約](./07-react-nextjs-rules.md) - React/Next.js固有の型使用
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
