# コーディング規約

本ドキュメントでは、プロジェクト全体で守るべきコーディング規約、リーダブルコードの原則、Next.js開発のベストプラクティスについて説明します。型安全性の確保、単一責任の原則、そしてESLint/Prettierの設定を含む包括的なガイドラインを提供します。

## 目次

1. [基本原則](#基本原則)
2. [設計原則](#設計原則)
3. [リーダブルコード原則](#リーダブルコード原則)
4. [Next.js開発ベストプラクティス](#nextjs開発ベストプラクティス)
5. [命名規則](#命名規則)
6. [TypeScript規約](#typescript規約)
7. [React/Next.js規約](#reactnextjs規約)
8. [ESLint主要ルール](#eslint主要ルール)
9. [Prettier設定](#prettier設定)
10. [コマンド一覧](#コマンド一覧)
11. [VSCode設定](#vscode設定)

---

## 基本原則

### 1. 型安全性の確保

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

### 2. 単一責任の原則

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

### 3. typeのみ使用（interface禁止）

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

## 設計原則

### SOLID原則

SOLID原則は、オブジェクト指向設計における5つの基本原則です。保守性が高く、拡張しやすいコードを書くための指針となります。

#### S: 単一責任の原則（Single Responsibility Principle）

**原則:** クラスや関数は1つの責任のみを持ち、変更する理由は1つだけであるべき。

```typescript
// ❌ Bad: 複数の責任を持つクラス
class UserService {
  async createUser(data: UserData): Promise<User> {
    // バリデーション
    if (!data.email.includes('@')) {
      throw new Error('無効なメール');
    }

    // データベース操作
    const user = await db.users.create(data);

    // メール送信
    await this.sendWelcomeEmail(user.email);

    // ログ記録
    console.log(`ユーザー作成: ${user.id}`);

    return user;
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    // メール送信処理
  }
}

// ✅ Good: 責任を分離
class UserValidator {
  validate(data: UserData): void {
    if (!data.email.includes('@')) {
      throw new Error('無効なメール');
    }
  }
}

class UserRepository {
  async create(data: UserData): Promise<User> {
    return await db.users.create(data);
  }
}

class EmailService {
  async sendWelcomeEmail(email: string): Promise<void> {
    // メール送信処理
  }
}

class UserLogger {
  logUserCreation(userId: string): void {
    console.log(`ユーザー作成: ${userId}`);
  }
}

class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailService,
    private logger: UserLogger
  ) {}

  async createUser(data: UserData): Promise<User> {
    this.validator.validate(data);
    const user = await this.repository.create(data);
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.logUserCreation(user.id);

    return user;
  }
}
```

**なぜ悪いのか:**

- 1つのクラスが複数の理由で変更される（バリデーション変更、DB変更、メール変更など）
- テストが困難（すべての依存関係をモックする必要がある）
- 再利用性が低い

**改善方法:**

- 各責任を独立したクラス・関数に分離
- 各クラスは1つの明確な目的を持つ
- 変更理由が1つだけになるように設計

#### O: 開放閉鎖の原則（Open-Closed Principle）

**原則:** ソフトウェアの構成要素は拡張に対して開いており、修正に対して閉じているべき。

```typescript
// ❌ Bad: 新しい形状を追加するたびにコードを修正
class AreaCalculator {
  calculateArea(shape: Shape): number {
    if (shape.type === 'circle') {
      return Math.PI * shape.radius ** 2;
    } else if (shape.type === 'rectangle') {
      return shape.width * shape.height;
    } else if (shape.type === 'triangle') {
      // 三角形を追加するために既存のコードを修正
      return (shape.base * shape.height) / 2;
    }

    throw new Error('未知の形状');
  }
}

// ✅ Good: 拡張に開いており、修正に閉じている
type Shape = {
  calculateArea(): number;
};

type Circle = Shape & {
  type: 'circle';
  radius: number;
};

type Rectangle = Shape & {
  type: 'rectangle';
  width: number;
  height: number;
};

type Triangle = Shape & {
  type: 'triangle';
  base: number;
  height: number;
};

const createCircle = (radius: number): Circle => ({
  type: 'circle',
  radius,
  calculateArea: () => Math.PI * radius ** 2,
});

const createRectangle = (width: number, height: number): Rectangle => ({
  type: 'rectangle',
  width,
  height,
  calculateArea: () => width * height,
});

const createTriangle = (base: number, height: number): Triangle => ({
  type: 'triangle',
  base,
  height,
  calculateArea: () => (base * height) / 2,
});

class AreaCalculator {
  calculateArea(shape: Shape): number {
    return shape.calculateArea();
  }
}
```

**なぜ悪いのか:**

- 新機能追加時に既存コードを修正する必要がある
- 修正によって既存機能が壊れるリスクがある
- コードが肥大化しやすい

**改善方法:**

- 抽象化を活用（型、インターフェース的な構造）
- 新機能は新しいコードで追加する
- 既存コードを修正せずに拡張可能にする

#### L: リスコフの置換原則（Liskov Substitution Principle）

**原則:** 基底型のオブジェクトは、派生型のオブジェクトで置き換え可能であるべき。

```typescript
// ❌ Bad: 派生型が基底型の契約を破る
type Bird = {
  fly(): void;
};

type Sparrow = Bird & {
  name: 'sparrow';
};

type Penguin = Bird & {
  name: 'penguin';
};

const createSparrow = (): Sparrow => ({
  name: 'sparrow',
  fly: () => console.log('飛んでいます'),
});

const createPenguin = (): Penguin => ({
  name: 'penguin',
  fly: () => {
    throw new Error('ペンギンは飛べません'); // 契約違反
  },
});

// ✅ Good: 適切な抽象化で契約を守る
type Bird = {
  move(): void;
};

type FlyingBird = Bird & {
  fly(): void;
};

type SwimmingBird = Bird & {
  swim(): void;
};

type Sparrow = FlyingBird & {
  name: 'sparrow';
};

type Penguin = SwimmingBird & {
  name: 'penguin';
};

const createSparrow = (): Sparrow => ({
  name: 'sparrow',
  move: () => console.log('移動しています'),
  fly: () => console.log('飛んでいます'),
});

const createPenguin = (): Penguin => ({
  name: 'penguin',
  move: () => console.log('移動しています'),
  swim: () => console.log('泳いでいます'),
});
```

**なぜ悪いのか:**

- 基底型として扱う際に予期しない動作が発生
- エラーハンドリングが複雑になる
- 抽象化が不適切

**改善方法:**

- 派生型は基底型の契約を守る
- 不適切な継承関係を見直す
- より適切な抽象化を行う

#### I: インターフェース分離の原則（Interface Segregation Principle）

**原則:** クライアントは、使用しないメソッドへの依存を強制されるべきではない。

```typescript
// ❌ Bad: 大きすぎるインターフェース
type Worker = {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
};

// ロボットは食事も睡眠も不要
type Robot = Worker & {
  name: string;
};

const createRobot = (name: string): Robot => ({
  name,
  work: () => console.log('作業中'),
  eat: () => {
    throw new Error('ロボットは食事しません');
  },
  sleep: () => {
    throw new Error('ロボットは睡眠不要');
  },
  attendMeeting: () => console.log('会議に参加'),
});

// ✅ Good: インターフェースを分離
type Workable = {
  work(): void;
};

type Eatable = {
  eat(): void;
};

type Sleepable = {
  sleep(): void;
};

type MeetingAttendee = {
  attendMeeting(): void;
};

type Human = Workable & Eatable & Sleepable & MeetingAttendee & {
  name: string;
};

type Robot = Workable & MeetingAttendee & {
  name: string;
};

const createRobot = (name: string): Robot => ({
  name,
  work: () => console.log('作業中'),
  attendMeeting: () => console.log('会議に参加'),
});

const createHuman = (name: string): Human => ({
  name,
  work: () => console.log('作業中'),
  eat: () => console.log('食事中'),
  sleep: () => console.log('睡眠中'),
  attendMeeting: () => console.log('会議に参加'),
});
```

**なぜ悪いのか:**

- 使用しない機能の実装を強制される
- 不要な依存関係が生まれる
- 変更の影響範囲が広がる

**改善方法:**

- 小さく、目的に特化した型定義を作る
- クライアントが必要とする機能だけを提供
- 複数の小さな型を組み合わせる

#### D: 依存性逆転の原則（Dependency Inversion Principle）

**原則:** 上位モジュールは下位モジュールに依存すべきではなく、両者とも抽象に依存すべき。

```typescript
// ❌ Bad: 具体的な実装に依存
class MySQLDatabase {
  connect(): void {
    console.log('MySQL接続');
  }

  query(sql: string): any {
    console.log(`クエリ実行: ${sql}`);
  }
}

class UserService {
  private database: MySQLDatabase;

  constructor() {
    this.database = new MySQLDatabase(); // 具体的な実装に依存
  }

  getUser(id: string): User {
    this.database.connect();

    return this.database.query(`SELECT * FROM users WHERE id = '${id}'`);
  }
}

// ✅ Good: 抽象に依存
type Database = {
  connect(): void;
  query(sql: string): any;
};

class MySQLDatabase implements Database {
  connect(): void {
    console.log('MySQL接続');
  }

  query(sql: string): any {
    console.log(`クエリ実行: ${sql}`);
  }
}

class PostgreSQLDatabase implements Database {
  connect(): void {
    console.log('PostgreSQL接続');
  }

  query(sql: string): any {
    console.log(`クエリ実行: ${sql}`);
  }
}

class UserService {
  constructor(private database: Database) {} // 抽象に依存

  getUser(id: string): User {
    this.database.connect();

    return this.database.query(`SELECT * FROM users WHERE id = '${id}'`);
  }
}

// 使用例
const mysqlDb = new MySQLDatabase();
const postgresDb = new PostgreSQLDatabase();
const userService1 = new UserService(mysqlDb);
const userService2 = new UserService(postgresDb);
```

**なぜ悪いのか:**

- 具体的な実装に強く結合される
- テストが困難（モックが作れない）
- 実装の変更が困難

**改善方法:**

- 抽象型（type）を定義し、それに依存する
- 依存性注入（Dependency Injection）を使用
- 具体的な実装は外部から渡す

### DRY原則（Don't Repeat Yourself）

**原則:** 同じコードを繰り返し書かない。知識は一箇所にまとめる。

```typescript
// ❌ Bad: コードの重複
export const createUser = async (data: UserData): Promise<User> => {
  if (!data.email.includes('@')) {
    throw new Error('無効なメール');
  }
  if (data.name.length < 2) {
    throw new Error('名前が短すぎます');
  }

  return await db.users.create(data);
};

export const updateUser = async (id: string, data: UserData): Promise<User> => {
  if (!data.email.includes('@')) {
    throw new Error('無効なメール');
  }
  if (data.name.length < 2) {
    throw new Error('名前が短すぎます');
  }

  return await db.users.update(id, data);
};

// ✅ Good: 共通処理を関数に抽出
const validateUserData = (data: UserData): void => {
  if (!data.email.includes('@')) {
    throw new Error('無効なメール');
  }
  if (data.name.length < 2) {
    throw new Error('名前が短すぎます');
  }
};

export const createUser = async (data: UserData): Promise<User> => {
  validateUserData(data);

  return await db.users.create(data);
};

export const updateUser = async (id: string, data: UserData): Promise<User> => {
  validateUserData(data);

  return await db.users.update(id, data);
};

// さらに良い: 定数も共通化
const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;

const validateUserData = (data: UserData): void => {
  if (!EMAIL_VALIDATION_REGEX.test(data.email)) {
    throw new Error('無効なメール');
  }
  if (data.name.length < MIN_NAME_LENGTH) {
    throw new Error(`名前は${MIN_NAME_LENGTH}文字以上である必要があります`);
  }
};
```

**なぜ悪いのか:**

- コードの変更時に複数箇所を修正する必要がある
- 修正漏れによるバグが発生しやすい
- メンテナンスコストが高い

**改善方法:**

- 共通処理を関数・モジュールに抽出
- 定数を一箇所で定義
- ユーティリティ関数を活用

### KISS原則（Keep It Simple, Stupid）

**原則:** シンプルに保つ。複雑さを避ける。

```typescript
// ❌ Bad: 不必要に複雑
export const getUserStatus = (user: User): string => {
  return user.isActive
    ? user.lastLoginAt
      ? Date.now() - user.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000
        ? user.role === 'admin'
          ? 'アクティブな管理者'
          : 'アクティブなユーザー'
        : '非アクティブ'
      : '未ログイン'
    : '無効';
};

// ✅ Good: シンプルで読みやすい
export const getUserStatus = (user: User): string => {
  if (!user.isActive) {
    return '無効';
  }

  if (!user.lastLoginAt) {
    return '未ログイン';
  }

  const isRecentlyActive = Date.now() - user.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  if (!isRecentlyActive) {
    return '非アクティブ';
  }

  return user.role === 'admin' ? 'アクティブな管理者' : 'アクティブなユーザー';
};
```

**なぜ悪いのか:**

- 複雑なコードは理解しにくい
- バグが混入しやすい
- メンテナンスが困難

**改善方法:**

- ネストを減らす（早期リターン）
- 説明変数を使用
- 複雑な条件は関数に抽出

### YAGNI原則（You Aren't Gonna Need It）

**原則:** 必要になるまで実装しない。過剰な機能追加を避ける。

```typescript
// ❌ Bad: 使われない機能を実装
type UserService = {
  createUser(data: UserData): Promise<User>;
  updateUser(id: string, data: UserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  // 以下は現時点で使われない
  bulkCreateUsers(data: UserData[]): Promise<User[]>;
  bulkUpdateUsers(updates: Array<{ id: string; data: UserData }>): Promise<User[]>;
  bulkDeleteUsers(ids: string[]): Promise<void>;
  exportUsersToCSV(): Promise<string>;
  exportUsersToJSON(): Promise<string>;
  exportUsersToXML(): Promise<string>;
  importUsersFromCSV(csv: string): Promise<User[]>;
  importUsersFromJSON(json: string): Promise<User[]>;
  importUsersFromXML(xml: string): Promise<User[]>;
};

// ✅ Good: 必要な機能のみ実装
type UserService = {
  createUser(data: UserData): Promise<User>;
  updateUser(id: string, data: UserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  // 必要になったら追加する
};
```

**なぜ悪いのか:**

- 不要なコードはメンテナンスコストを増やす
- テストが複雑になる
- コードが肥大化する

**改善方法:**

- 現時点で必要な機能のみ実装
- 将来必要になったら追加する
- 過剰な設計を避ける

---

## リーダブルコード原則

### 第1章: 理解しやすいコード

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

### 第2章: 名前に情報を詰め込む

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

### 第3章: 誤解されない名前

**原則:** 名前が他の意味と間違えられることはないか？

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

### 第4章: 美しさ

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

### 第5章: コメントすべきことを知る

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

### 第6章: コメントは正確で簡潔に

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

### 第7章: 制御フローを読みやすく

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

### 第8章: 巨大な式を分割

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

### 第9章: 変数と読みやすさ

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

### 第10章: 無関係の下位問題を抽出

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

### 第11章: 一度に1つのことを

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

### 第12章: コードに思いを込める

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

### 第13章: 短いコードを書く

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

### 第14章: テストと読みやすさ

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

## Next.js開発ベストプラクティス

### 1. Server ComponentとClient Componentの使い分け

**原則:** デフォルトはServer Component、必要な場合のみClient Component。

```typescript
// ❌ Bad: 不必要にClient Component化
'use client';

type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// ✅ Good: Server Componentとして実装（データフェッチも可能）
type UserListProps = {
  users: User[];
};

export const UserList = ({ users }: UserListProps) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// ✅ Good: 状態が必要な部分のみClient Component化
'use client';

type UserSearchProps = {
  onSearch: (query: string) => void;
};

export const UserSearch = ({ onSearch }: UserSearchProps) => {
  const [query, setQuery] = useState('');

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

**なぜ悪いのか:**

- 不要なJavaScriptがクライアントに送信される
- パフォーマンスが低下する
- サーバーサイドでのデータフェッチができない

**改善方法:**

- デフォルトはServer Component
- 状態管理、イベントハンドラ、ブラウザAPIが必要な場合のみClient Component
- Client Componentは可能な限り下位のコンポーネントに配置

### 2. データフェッチングの最適化

> ⚠️ **このプロジェクトでは使用しません**
> このプロジェクトはFastAPIバックエンドを使用するため、Next.jsのServer Componentでのデータフェッチは行いません。
> Client Component + TanStack Queryを使用してFastAPI APIを直接呼び出します。

**原則:** データは可能な限りサーバーで取得する。

```typescript
// ❌ Bad: Client Componentでデータフェッチ
'use client';

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
};

// ✅ Good: Server Componentでデータフェッチ
export const UserProfile = async () => {
  const user = await fetchUser();

  return <div>{user.name}</div>;
};

// ✅ Good: 並列データフェッチ
export const Dashboard = async () => {
  // 並列で実行
  const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <CommentList comments={comments} />
    </div>
  );
};
```

**なぜ悪いのか:**

- クライアントサイドでのデータフェッチは遅い
- ローディング状態の管理が複雑
- SEOに不利

**改善方法:**

- Server Componentで`async/await`を使ってデータフェッチ
- 複数のデータフェッチは`Promise.all`で並列化
- キャッシュ戦略を適切に設定

### 3. キャッシュ戦略の適切な使用

> ⚠️ **このプロジェクトでは使用しません**
> Next.jsのServer Componentでのキャッシュ戦略は使用しません。
> TanStack Queryのキャッシュ機能を使用します。

**原則:** データの特性に応じてキャッシュ戦略を選択する。

```typescript
// ❌ Bad: キャッシュ設定なし（デフォルトキャッシュに依存）
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://api.example.com/users');

  return res.json();
};

// ✅ Good: 明示的なキャッシュ設定
// 静的データ（変更頻度が低い）
export const fetchStaticData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/static-data', {
    cache: 'force-cache', // 永続的にキャッシュ
  });

  return res.json();
};

// 動的データ（リアルタイム性が重要）
export const fetchRealtimeData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/realtime-data', {
    cache: 'no-store', // キャッシュしない
  });

  return res.json();
};

// 定期的に更新されるデータ
export const fetchPeriodicData = async (): Promise<Data[]> => {
  const res = await fetch('https://api.example.com/periodic-data', {
    next: { revalidate: 3600 }, // 1時間ごとに再検証
  });

  return res.json();
};
```

**なぜ悪いのか:**

- デフォルトキャッシュに依存すると予期しない動作が起きる
- データの特性を考慮しないとパフォーマンスやUXが悪化

**改善方法:**

- 静的データは`cache: 'force-cache'`
- 動的データは`cache: 'no-store'`
- 定期更新データは`next: { revalidate: 秒数 }`

### 4. ルーティングとナビゲーション

**原則:** App Routerの機能を最大限活用する。

```typescript
// ❌ Bad: window.locationを使った遷移
const navigateToUser = (userId: string) => {
  window.location.href = `/sample-users/${userId}`;
};

// ✅ Good: Next.jsのルーターを使用
'use client';

import { useRouter } from 'next/navigation';

export const UserCard = ({ user }: { user: User }) => {
  const router = useRouter();

  const navigateToUser = () => {
    router.push(`/sample-users/${user.id}`);
  };

  return <button onClick={navigateToUser}>詳細を見る</button>;
};

// ✅ Good: Linkコンポーネントを使用（推奨）
import Link from 'next/link';

export const UserCard = ({ user }: { user: User }) => {
  return (
    <Link href={`/sample-users/${user.id}`} className="button">
      詳細を見る
    </Link>
  );
};
```

**なぜ悪いのか:**

- `window.location`はページ全体がリロードされる
- クライアントサイドナビゲーションの利点が失われる
- プリフェッチが効かない

**改善方法:**

- `<Link>`コンポーネントを優先的に使用
- プログラマティックな遷移が必要な場合は`useRouter`
- `window.location`は外部サイトへの遷移のみに使用

### 5. 画像最適化

**原則:** next/imageを常に使用する。

```typescript
// ❌ Bad: imgタグを直接使用
export const UserAvatar = ({ user }: { user: User }) => {
  return <img src={user.avatarUrl} alt={user.name} width={100} height={100} />;
};

// ✅ Good: next/imageを使用
import Image from 'next/image';

export const UserAvatar = ({ user }: { user: User }) => {
  return <Image src={user.avatarUrl} alt={user.name} width={100} height={100} className="rounded-full" />;
};

// ✅ Good: 外部画像の場合はremotePatterns設定
// next.config.js
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}
```

**なぜ悪いのか:**

- 最適化されていない画像はパフォーマンスを低下させる
- レイアウトシフトが発生する
- レスポンシブ対応が手動で必要

**改善方法:**

- `next/image`を常に使用
- `width`と`height`を指定してレイアウトシフトを防ぐ
- 必要に応じて`priority`プロップでプリロード

### 6. メタデータとSEO

**原則:** メタデータは静的または動的に適切に設定する。

```typescript
// ❌ Bad: メタデータなし
export default function Page() {
  return <div>コンテンツ</div>;
}

// ✅ Good: 静的メタデータ
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー一覧',
  description: 'すべてのユーザーを表示します',
};

export default function UsersPage() {
  return <div>ユーザー一覧</div>;
}

// ✅ Good: 動的メタデータ
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params;
  const user = await fetchUser(id);

  return {
    title: `${user.name} - ユーザープロフィール`,
    description: `${user.name}のプロフィールページ`,
  };
};

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const user = await fetchUser(id);

  return <div>{user.name}</div>;
}
```

**なぜ悪いのか:**

- メタデータがないとSEOに不利
- ソーシャルシェア時に適切な情報が表示されない

**改善方法:**

- すべてのページに`metadata`を設定
- 動的ページは`generateMetadata`を使用
- OGP画像も設定する

### 7. エラーハンドリング

**原則:** エラー境界とローディング状態を適切に設定する。

```typescript
// ❌ Bad: エラーハンドリングなし
export default async function Page() {
  const data = await fetchData(); // エラーが発生したら全体がクラッシュ

  return <div>{data.title}</div>;
}

// ✅ Good: error.tsxでエラー境界を設定
// app/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  );
}

// ✅ Good: loading.tsxでローディング状態を設定
// app/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>;
}

// ✅ Good: try-catchでエラーハンドリング
export default async function Page() {
  try {
    const data = await fetchData();

    return <div>{data.title}</div>;
  } catch (error) {
    return <div>データの取得に失敗しました</div>;
  }
}
```

**なぜ悪いのか:**

- エラーが発生するとアプリ全体がクラッシュする
- ローディング状態がないとUXが悪い

**改善方法:**

- `error.tsx`でエラー境界を設定
- `loading.tsx`でローディング状態を設定
- 必要に応じて`try-catch`でエラーハンドリング

### 8. 環境変数の適切な使用

**原則:** サーバーとクライアントの環境変数を区別する。

```typescript
// ❌ Bad: クライアントコンポーネントでサーバー専用の環境変数を使用
'use client';

export const ApiClient = () => {
  // これは動作しない（クライアントでは undefined）
  const apiKey = process.env.SECRET_API_KEY;

  return <div>API Key: {apiKey}</div>;
};

// ✅ Good: サーバーコンポーネントでサーバー専用の環境変数を使用
export const fetchData = async (): Promise<Data> => {
  const apiKey = process.env.SECRET_API_KEY; // サーバーでのみアクセス可能

  const res = await fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  return res.json();
};

// ✅ Good: クライアントで公開する環境変数は NEXT_PUBLIC_ プレフィックス
// .env.local
// NEXT_PUBLIC_API_URL=https://api.example.com

'use client';

export const ApiClient = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // クライアントでアクセス可能

  return <div>API URL: {apiUrl}</div>;
};
```

**なぜ悪いのか:**

- クライアントで機密情報が漏洩する
- クライアントで環境変数が`undefined`になる

**改善方法:**

- 機密情報はサーバーコンポーネントでのみ使用
- クライアントで必要な環境変数は`NEXT_PUBLIC_`プレフィックスを付ける
- 環境変数の型定義を作成する

### 9. パフォーマンス最適化

**原則:** パフォーマンスを意識したコードを書く。

```typescript
// ❌ Bad: 不要な再レンダリング
'use client';

export const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild /> {/* countが変わるたびに再レンダリング */}
    </div>
  );
};

// ✅ Good: メモ化で再レンダリングを防ぐ
'use client';

import { memo } from 'react';

const ExpensiveChild = memo(() => {
  // 重い処理
  return <div>Expensive Component</div>;
});

export const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild /> {/* 再レンダリングされない */}
    </div>
  );
};

// ✅ Good: useMemoで計算結果をメモ化
'use client';

import { useMemo } from 'react';

export const DataTable = ({ data }: { data: Item[] }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <table>
      {sortedData.map((item) => (
        <tr key={item.id}>
          <td>{item.name}</td>
        </tr>
      ))}
    </table>
  );
};
```

**なぜ悪いのか:**

- 不要な再レンダリングはパフォーマンスを低下させる
- 重い計算が毎回実行される

**改善方法:**

- `memo`で不要な再レンダリングを防ぐ
- `useMemo`で計算結果をメモ化
- `useCallback`で関数をメモ化

### 10. 型安全性の確保

**原則:** APIレスポンスやフォームデータは厳密に型定義する。

```typescript
// ❌ Bad: any型の使用
export const fetchUsers = async (): Promise<any> => {
  const res = await fetch('/api/users');

  return res.json();
};

// ✅ Good: 明確な型定義
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ApiResponse<T> = {
  data: T;
  error?: string;
};

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const res = await fetch('/api/users');

  return res.json();
};

// ✅ Good: Zodでランタイム検証と型推論
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users');
  const data = await res.json();

  return UserSchema.array().parse(data);
};
```

**なぜ悪いのか:**

- `any`型は型安全性を失う
- ランタイムエラーが発生しやすい
- IDEの補完が効かない

**改善方法:**

- すべてのデータに明確な型定義を付ける
- Zodなどでランタイム検証を行う
- APIレスポンスの型を統一する

---

## 命名規則

| タイプ               | 形式                             | 例                    |
| -------------------- | -------------------------------- | --------------------- |
| **コンポーネント**   | kebab-case                       | `user-form.tsx`       |
| **フック**           | kebab-case, `use-`プレフィックス | `use-users.ts`        |
| **ストア**           | kebab-case, `-store`サフィックス | `auth-store.ts`       |
| **API**              | kebab-case                       | `get-users.ts`        |
| **型定義**           | PascalCase                       | `User`、`UserProfile` |
| **定数**             | UPPER_SNAKE_CASE                 | `MAX_RETRY_COUNT`     |
| **boolean変数/関数** | is/has/can/shouldプレフィックス  | `isActive`、`canEdit` |

```typescript
// ファイル名: user-form.tsx
export const UserForm = () => {
  /* ... */
};

// ファイル名: use-users.ts
export const useUsers = () => {
  /* ... */
};

// 型定義
type User = {
  id: string;
  name: string;
};

// 定数
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// boolean
const isActive = true;
const hasPermission = checkPermission();
const canEdit = user.role === 'admin';
```

---

## TypeScript規約

### 1. エクスポート関数は型を明示

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

### 2. Nullish coalescing演算子

```typescript
// ✅ Good
const userName = user?.name ?? 'ゲスト';

// ❌ Bad
const userName = user && user.name ? user.name : 'ゲスト';
```

### 3. Optional Chaining

```typescript
// ✅ Good
const city = user?.address?.city;

// ❌ Bad
const city = user && user.address && user.address.city;
```

### 4. Type Guards

```typescript
// ✅ Good: 型ガードを使用
const isUser = (value: unknown): value is User => {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
};

if (isUser(data)) {
  console.log(data.name); // 型安全
}
```

---

## React/Next.js規約

### 1. Reactのimportは不要

```typescript
// ✅ Good: Next.js 15の新JSX変換
export const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>;
};

// ❌ Bad: Reactをimport（不要）
import React from 'react';
```

### 2. Props型定義（type使用）

```typescript
// ✅ Good
type UserFormProps = {
  user: User;
  onSubmit: (data: UserFormData) => void;
};

export const UserForm = ({ user, onSubmit }: UserFormProps) => {
  return <form>...</form>;
};
```

### 3. Server/Client Components

```typescript
// ✅ Server Component（デフォルト）
export const UserList = async () => {
  const users = await fetchUsers();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// ✅ Client Component（必要な場合のみ）
'use client';

export const UserForm = () => {
  const [data, setData] = useState<FormData>();

  return <form>...</form>;
};
```

---

## ESLint主要ルール

### 1. `@typescript-eslint/consistent-type-definitions`

interfaceを禁止し、typeの使用を強制。

### 2. `prefer-arrow-callback` / `func-style`

```typescript
// ❌ Bad
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### 3. `padding-line-between-statements`

return文の前に空行を必須。

```typescript
// ❌ Bad
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total;
};

// ✅ Good
export const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return total;
};
```

---

## Prettier設定

| 設定項目         | 値      |
| ---------------- | ------- |
| `printWidth`     | `140`   |
| `tabWidth`       | `2`     |
| `semi`           | `true`  |
| `singleQuote`    | `true`  |
| `trailingComma`  | `"es5"` |
| `bracketSpacing` | `true`  |
| `arrowParens`    | `always`|

---

## コマンド一覧

### コード品質管理

```bash
# ESLintチェック
pnpm lint

# ESLint自動修正
pnpm lint:fix

# Prettierで整形
pnpm format

# すべてのチェックを一括実行
pnpm check

# すべてのチェックと自動修正を一括実行
pnpm check:fix
```

### 推奨フロー

**コミット前:**

```bash
# すべてのチェックと自動修正を実行
pnpm check:fix

# ビルド確認
pnpm build
```

---

## VSCode設定

### 必要な拡張機能

| 拡張機能                    | ID                               |
| --------------------------- | -------------------------------- |
| **ESLint**                  | `dbaeumer.vscode-eslint`         |
| **Prettier**                | `esbenp.prettier-vscode`         |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss`    |

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## 参考リンク

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [リーダブルコード](https://www.oreilly.co.jp/books/9784873115658/)
