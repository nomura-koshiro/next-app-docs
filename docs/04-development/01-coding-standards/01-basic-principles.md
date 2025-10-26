# 基本原則

本セクションでは、すべてのコードで守るべき基本的な原則について説明します。

## 目次

1. [型安全性の確保](#型安全性の確保)
2. [単一責任の原則](#単一責任の原則)
3. [typeのみ使用（interface禁止）](#typeのみ使用interface禁止)

---

## 型安全性の確保

```typescript
// ❌ Bad: any型は型安全性を損なう
export const fetchData = async (id: any) => {
  return await api.get(`/data/${id}`);
};

// ✅ Good: 明確な型定義で型安全性を確保
export const fetchData = async (id: string): Promise<DataResponse> => {
  return await api.get<DataResponse>(`/data/${id}`);
};
```

**なぜ悪いのか:**

- `any`型は型チェックを無効化し、実行時エラーの原因となる
- 戻り値の型が不明確で、利用側でのミスを招く

**改善方法:**

- すべての引数と戻り値に明確な型を指定する
- `any`の代わりに`unknown`や適切な型を使用する

---

## 単一責任の原則

各関数・コンポーネントは1つの責任のみを持つ。

```typescript
// ❌ Bad: 複数の責任を持つ関数
export const processUserData = async (userId: string) => {
  const user = await fetchUser(userId);
  const validatedUser = validateUser(user);
  await saveUser(validatedUser);
  await sendEmail(user.email);
  await updateCache(userId);

  return validatedUser;
};

// ✅ Good: 単一の責任に分割
export const fetchAndValidateUser = async (userId: string): Promise<User> => {
  const user = await fetchUser(userId);

  return validateUser(user);
};

export const saveAndNotifyUser = async (user: User): Promise<void> => {
  await saveUser(user);
  await sendEmail(user.email);
  await updateCache(user.id);
};
```

**なぜ悪いのか:**

- テストが困難になる
- 再利用性が低い
- 変更の影響範囲が広い

**改善方法:**

- 1つの関数は1つのことだけを行う
- 関数名がその責任を明確に表現する

---

## typeのみ使用（interface禁止）

```typescript
// ✅ Good: typeを使用
type User = {
  id: string;
  name: string;
  email: string;
};

// ❌ Bad: interfaceは使用禁止
interface User {
  id: string;
  name: string;
  email: string;
}
```

**なぜ悪いのか:**

- プロジェクト内で`type`と`interface`が混在すると一貫性が失われる
- `interface`の拡張機能（Declaration Merging）は予期しない動作の原因となる

**改善方法:**

- すべての型定義に`type`を使用する
- ESLintルールで`interface`を禁止する

---

## 関連リンク

- [設計原則](./02-design-principles.md) - SOLID、DRY、KISS、YAGNI原則
- [リーダブルコード原則](./03-readable-code.md) - 読みやすいコードの書き方
- [TypeScript規約](./06-typescript-rules.md) - TypeScript固有の規約
