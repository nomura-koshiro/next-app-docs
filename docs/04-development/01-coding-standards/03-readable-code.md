# リーダブルコード原則

『リーダブルコード』の原則に基づいた、読みやすく保守しやすいコードの書き方について説明します。

## 目次

1. [第1章: 理解しやすいコード](#第1章-理解しやすいコード)
2. [第2章: 名前に情報を詰め込む](#第2章-名前に情報を詰め込む)
3. [第3章: 誤解されない名前](#第3章-誤解されない名前)
4. [第4章: 美しさ](#第4章-美しさ)
5. [第5章: コメントすべきことを知る](#第5章-コメントすべきことを知る)
6. [第6章: コメントは正確で簡潔に](#第6章-コメントは正確で簡潔に)
7. [第7章: 制御フローを読みやすく](#第7章-制御フローを読みやすく)
8. [第8章: 巨大な式を分割](#第8章-巨大な式を分割)
9. [第9章: 変数と読みやすさ](#第9章-変数と読みやすさ)
10. [第10章: 無関係の下位問題を抽出](#第10章-無関係の下位問題を抽出)
11. [第11章: 一度に1つのことを](#第11章-一度に1つのことを)
12. [第12章: コードに思いを込める](#第12章-コードに思いを込める)
13. [第13章: 短いコードを書く](#第13章-短いコードを書く)
14. [第14章: テストと読みやすさ](#第14章-テストと読みやすさ)

---

## 第1章: 理解しやすいコード

**原則:** コードは他の人が最短時間で理解できるように書く。

```typescript
// ❌ Bad: 変数名が不明確
const d = new Date();
const t = d.getTime();

// ✅ Good: 変数名が意図を明確に表現
const currentDate = new Date();
const timestampInMilliseconds = currentDate.getTime();
```

**なぜ悪いのか:**

- `d`や`t`だけでは何を表すか分からない
- コードを読む人が文脈を推測する必要がある

**改善方法:**

- 変数名は明確で具体的にする
- 省略形は広く知られているもの以外使わない

---

## 第2章: 名前に情報を詰め込む

**原則:** 名前には最大限の情報を詰め込む。

```typescript
// ❌ Bad: 単位や制約が不明
type Product = {
  size: number;
  delay: number;
  limit: number;
};

// ✅ Good: 単位や制約を明確に
type Product = {
  sizeInMegabytes: number;
  delayInSeconds: number;
  maxRetryLimit: number;
};
```

**なぜ悪いのか:**

- `size`や`delay`だけでは単位が分からない
- 値の範囲や制約が不明確

**改善方法:**

- 単位を名前に含める（`InSeconds`、`InBytes`など）
- 最小値・最大値を示す接頭辞を使う（`max`、`min`など）

```typescript
// ❌ Bad: booleanの名前が曖昧
const read = true;

// ✅ Good: is/has/canなどの接頭辞で意図を明確に
const isReadable = true;
const hasPermission = true;
const canEdit = false;
```

---

## 第3章: 誤解されない名前

**原則:** 名前が他の意味と間違えられることはないか?

```typescript
// ❌ Bad: filterは「除外する」とも「抽出する」とも取れる
const results = filter(users);

// ✅ Good: 明確な動詞を使用
const activeUsers = selectActiveUsers(users);
const excludedUsers = excludeInactiveUsers(users);
```

**なぜ悪いのか:**

- `filter`は文脈によって「抽出」と「除外」の両方の意味を持つ
- 読み手が誤解する可能性がある

**改善方法:**

- `select`（選択）、`exclude`（除外）など明確な動詞を使う
- コメントではなく名前で意図を伝える

```typescript
// ❌ Bad: 範囲が不明確（境界を含む？含まない？）
const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// ✅ Good: 境界を明確に
const isInRangeInclusive = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

const isInRangeExclusive = (value: number, min: number, max: number): boolean => {
  return value > min && value < max;
};
```

---

## 第4章: 美しさ

**原則:** 一貫性のあるレイアウトで読みやすくする。

```typescript
// ❌ Bad: レイアウトが不揃い
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role: 'admin' | 'user';
};

// ✅ Good: 関連する項目をグループ化
type User = {
  // 識別情報
  id: string;
  name: string;
  email: string;

  // メタデータ
  createdAt: Date;
  updatedAt: Date;

  // ステータス
  isActive: boolean;
  role: 'admin' | 'user';
};
```

**なぜ悪いのか:**

- 関連する項目が離れていると全体像が把握しにくい
- 視覚的な整理がないと読みにくい

**改善方法:**

- 関連する項目をグループ化する
- コメントで区切りを明確にする
- 一貫したインデントと空行を使う

---

## 第5章: コメントすべきことを知る

**原則:** コードから読み取れることをコメントに書かない。

```typescript
// ❌ Bad: コードを繰り返すだけのコメント
// ユーザーIDを取得する
const userId = user.id;

// ✅ Good: コードから読み取れない「なぜ」を説明
// パフォーマンス最適化: 頻繁にアクセスされるため事前にキャッシュ
const cachedUserId = user.id;

// ❌ Bad: 実装の詳細をコメント
// i を 1 ずつ増やして配列をループ
for (let i = 0; i < users.length; i++) {
  // ...
}

// ✅ Good: 意図や理由をコメント
// 新しいユーザーから順に処理（作成日時の降順）
const sortedUsers = users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
```

**なぜ悪いのか:**

- コードを繰り返すだけのコメントは価値がない
- メンテナンスコストが増える（コードとコメントの二重管理）

**改善方法:**

- 「なぜ」を説明する（「何を」ではなく）
- コードで表現できることはコメントしない
- 定数には定義の理由を書く

```typescript
// ✅ Good: 定数の理由を説明
// APIレート制限を回避するため、リトライ間隔を指数関数的に増加
const MAX_RETRY_DELAY_SECONDS = 32;

// データベースの接続プールサイズ制限に合わせる
const MAX_CONCURRENT_REQUESTS = 10;
```

---

## 第6章: コメントは正確で簡潔に

**原則:** コメントは情報密度を高く、簡潔に書く。

```typescript
// ❌ Bad: 冗長なコメント
// この関数は、ユーザーの配列を受け取り、その中からアクティブなユーザーだけを
// 抽出して、新しい配列として返す関数です。
const getActiveUsers = (users: User[]): User[] => {
  return users.filter((user) => user.isActive);
};

// ✅ Good: 簡潔で情報密度の高いコメント
// アクティブなユーザーのみを抽出
const getActiveUsers = (users: User[]): User[] => {
  return users.filter((user) => user.isActive);
};
```

**なぜ悪いのか:**

- 冗長なコメントは読むのに時間がかかる
- 重要な情報が埋もれる

**改善方法:**

- 1文で済ませる
- 具体的な例を示す
- 曖昧な代名詞（それ、これ）を避ける

---

## 第7章: 制御フローを読みやすく

**原則:** 条件やループは自然な順序で書く。

```typescript
// ❌ Bad: 否定形と条件の順序が不自然
if (10 < length) {
  // ...
}

if (!isAdmin) {
  return;
}

// ✅ Good: 肯定形と自然な順序
if (length > 10) {
  // ...
}

if (isAdmin) {
  // 管理者の処理
} else {
  // 一般ユーザーの処理
}
```

**なぜ悪いのか:**

- 否定形は理解に時間がかかる
- 不自然な順序は混乱を招く

**改善方法:**

- 肯定形を優先する
- 変数は左、定数は右（`length > 10`）
- 単純な条件を先に書く

```typescript
// ❌ Bad: 深いネスト
const processUser = (user: User | null): string => {
  if (user) {
    if (user.isActive) {
      if (user.email) {
        return sendEmail(user.email);
      } else {
        return 'メールアドレスなし';
      }
    } else {
      return 'ユーザーが無効';
    }
  } else {
    return 'ユーザーが存在しない';
  }
};

// ✅ Good: 早期リターンでネストを減らす
const processUser = (user: User | null): string => {
  if (!user) {
    return 'ユーザーが存在しない';
  }

  if (!user.isActive) {
    return 'ユーザーが無効';
  }

  if (!user.email) {
    return 'メールアドレスなし';
  }

  return sendEmail(user.email);
};
```

---

## 第8章: 巨大な式を分割

**原則:** 巨大な式は説明変数で分割する。

```typescript
// ❌ Bad: 巨大で理解しにくい式
if (
  user.role === 'admin' &&
  user.isActive &&
  user.permissions.includes('write') &&
  Date.now() - user.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000
) {
  // ...
}

// ✅ Good: 説明変数で分割
const isAdmin = user.role === 'admin';
const isActive = user.isActive;
const hasWritePermission = user.permissions.includes('write');
const lastLoginWithinWeek = Date.now() - user.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000;

if (isAdmin && isActive && hasWritePermission && lastLoginWithinWeek) {
  // ...
}

// さらに良い: 意図を表す関数に抽出
const canEditContent = (user: User): boolean => {
  const isAdmin = user.role === 'admin';
  const isActive = user.isActive;
  const hasWritePermission = user.permissions.includes('write');
  const lastLoginWithinWeek = Date.now() - user.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  return isAdmin && isActive && hasWritePermission && lastLoginWithinWeek;
};

if (canEditContent(user)) {
  // ...
}
```

**なぜ悪いのか:**

- 複雑な条件式は読解に時間がかかる
- デバッグが困難
- 再利用できない

**改善方法:**

- 説明変数で式を分割する
- 意味のある名前をつける
- 関数に抽出して再利用可能にする

---

## 第9章: 変数と読みやすさ

**原則:** 変数のスコープを狭く、書き込み回数を減らす。

```typescript
// ❌ Bad: スコープが広く、変数が何度も書き換えられる
const calculateTotal = (items: Item[]): number => {
  let result = 0;
  let temp = 0;
  let i = 0;

  for (i = 0; i < items.length; i++) {
    temp = items[i].price * items[i].quantity;
    result = result + temp;
  }

  return result;
};

// ✅ Good: スコープを狭く、不変性を保つ
const calculateTotal = (items: Item[]): number => {
  return items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;

    return total + itemTotal;
  }, 0);
};
```

**なぜ悪いのか:**

- 変数のスコープが広いと、どこで値が変更されるか追いにくい
- 一時変数が多いとコードの意図が不明確になる

**改善方法:**

- 変数のスコープをできるだけ狭くする
- `const`を優先し、再代入を避ける
- 一時変数は意味のある名前をつける

---

## 第10章: 無関係の下位問題を抽出

**原則:** プロジェクト固有のコードと汎用的なコードを分離する。

```typescript
// ❌ Bad: ビジネスロジックと汎用的なユーティリティが混在
const processOrders = (orders: Order[]): void => {
  orders.forEach((order) => {
    // 日付フォーマット処理（汎用的）
    const year = order.createdAt.getFullYear();
    const month = String(order.createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(order.createdAt.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // ビジネスロジック
    console.log(`注文日: ${formattedDate}, 合計: ${order.total}`);
  });
};

// ✅ Good: 汎用的な処理を関数に抽出
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const processOrders = (orders: Order[]): void => {
  orders.forEach((order) => {
    const formattedDate = formatDate(order.createdAt);
    console.log(`注文日: ${formattedDate}, 合計: ${order.total}`);
  });
};
```

**なぜ悪いのか:**

- ビジネスロジックと汎用処理が混在すると可読性が下がる
- 汎用処理が再利用できない
- テストが困難

**改善方法:**

- 汎用的な処理はユーティリティ関数に抽出
- プロジェクト固有のロジックと分離
- ユーティリティ関数は別ファイルに配置

---

## 第11章: 一度に1つのことを

**原則:** 関数は1つのことだけを行う。

```typescript
// ❌ Bad: 複数のことを一度に行う
const updateUserProfile = async (userId: string, data: UpdateData): Promise<void> => {
  // バリデーション
  if (!data.email.includes('@')) {
    throw new Error('無効なメール');
  }

  // データ取得
  const user = await fetchUser(userId);

  // データ更新
  user.email = data.email;
  user.name = data.name;

  // 保存
  await saveUser(user);

  // 通知
  await sendEmail(user.email, '更新完了');

  // ログ
  console.log(`ユーザー ${userId} が更新されました`);
};

// ✅ Good: 1つのことに集中した関数に分割
const validateEmail = (email: string): void => {
  if (!email.includes('@')) {
    throw new Error('無効なメール');
  }
};

const updateUser = async (userId: string, data: UpdateData): Promise<User> => {
  const user = await fetchUser(userId);
  user.email = data.email;
  user.name = data.name;

  return await saveUser(user);
};

const notifyUserUpdate = async (email: string): Promise<void> => {
  await sendEmail(email, '更新完了');
};

const updateUserProfile = async (userId: string, data: UpdateData): Promise<void> => {
  validateEmail(data.email);
  const updatedUser = await updateUser(userId, data);
  await notifyUserUpdate(updatedUser.email);
};
```

**なぜ悪いのか:**

- 関数が長く、理解しにくい
- テストが困難
- 再利用できない

**改善方法:**

- 各タスクを個別の関数に分割
- 各関数は1つの責任のみを持つ
- メイン関数は各タスクを組み合わせる

---

## 第12章: コードに思いを込める

**原則:** コードを声に出して説明し、それをコードにする。

```typescript
// ❌ Bad: 実装の詳細が不明確
const process = (items: Item[]): Item[] => {
  return items.filter((item) => item.status === 1 && item.count > 0).map((item) => ({ ...item, processed: true }));
};

// ✅ Good: 意図を明確に表現
/**
 * アクティブで在庫のある商品を処理済みにする
 *
 * 処理対象:
 * - status === 1 (アクティブ)
 * - count > 0 (在庫あり)
 */
const markActiveItemsWithStockAsProcessed = (items: Item[]): Item[] => {
  const activeItemsWithStock = items.filter((item) => {
    const isActive = item.status === 1;
    const hasStock = item.count > 0;

    return isActive && hasStock;
  });

  return activeItemsWithStock.map((item) => ({
    ...item,
    processed: true,
  }));
};
```

**なぜ悪いのか:**

- コードの意図が伝わらない
- マジックナンバー（`1`）の意味が不明
- 処理の目的が分からない

**改善方法:**

- 処理を声に出して説明し、その説明を関数名にする
- マジックナンバーを定数に置き換える
- 複雑な条件は説明変数で分割

---

## 第13章: 短いコードを書く

**原則:** 不要なコードを削除し、標準ライブラリを活用する。

```typescript
// ❌ Bad: 車輪の再発明
const unique = <T>(array: T[]): T[] => {
  const result: T[] = [];
  for (const item of array) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }

  return result;
};

// ✅ Good: 標準機能を活用
const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// ❌ Bad: 使われていない機能
const formatUser = (user: User, options?: { includeEmail?: boolean; includePhone?: boolean; includeAddress?: boolean }) => {
  // 実際にはincludeEmailしか使われていない
  // ...
};

// ✅ Good: 必要な機能のみ実装
const formatUserWithEmail = (user: User): string => {
  return `${user.name} (${user.email})`;
};
```

**なぜ悪いのか:**

- 既存の標準機能を再実装するとバグの温床になる
- 使われない機能はメンテナンスコストを増やす

**改善方法:**

- 標準ライブラリやよく使われるライブラリを活用
- 必要になってから実装する（YAGNI原則）
- 不要なコードは削除する

---

## 第14章: テストと読みやすさ

**原則:** テストは読みやすく、保守しやすくする。

```typescript
// ❌ Bad: テストの意図が不明確
test('user test', () => {
  const u = { id: '1', name: 'Test', isActive: true };
  const r = processUser(u);
  expect(r).toBe(true);
});

// ✅ Good: テストの意図が明確
test('アクティブなユーザーは処理が成功する', () => {
  // Arrange（準備）
  const activeUser = {
    id: '1',
    name: 'Test User',
    isActive: true,
  };

  // Act（実行）
  const result = processUser(activeUser);

  // Assert（検証）
  expect(result).toBe(true);
});

test('非アクティブなユーザーは処理が失敗する', () => {
  const inactiveUser = {
    id: '2',
    name: 'Inactive User',
    isActive: false,
  };

  const result = processUser(inactiveUser);

  expect(result).toBe(false);
});
```

**なぜ悪いのか:**

- テストの意図が分からない
- 失敗時に原因が特定しにくい
- メンテナンスが困難

**改善方法:**

- テスト名は「何をテストするか」を明確に
- AAA パターン（Arrange-Act-Assert）を使う
- 1つのテストで1つのことをテスト

---

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [設計原則](./02-design-principles.md) - SOLID、DRY、KISS、YAGNI
- [命名規則](./05-naming-conventions.md) - 命名のガイドライン
- [リーダブルコード（書籍）](https://www.oreilly.co.jp/books/9784873115658/)
