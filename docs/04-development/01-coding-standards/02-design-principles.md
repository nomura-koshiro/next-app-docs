# 設計原則

保守性が高く、拡張しやすいコードを書くための設計原則について説明します。

## 目次

1. [SOLID原則](#solid原則)
   - [S: 単一責任の原則](#s-単一責任の原則single-responsibility-principle)
   - [O: 開放閉鎖の原則](#o-開放閉鎖の原則open-closed-principle)
   - [L: リスコフの置換原則](#l-リスコフの置換原則liskov-substitution-principle)
   - [I: インターフェース分離の原則](#i-インターフェース分離の原則interface-segregation-principle)
   - [D: 依存性逆転の原則](#d-依存性逆転の原則dependency-inversion-principle)
2. [DRY原則](#dry原則dont-repeat-yourself)
3. [KISS原則](#kiss原則keep-it-simple-stupid)
4. [YAGNI原則](#yagni原則you-arent-gonna-need-it)

---

## SOLID原則

SOLID原則は、オブジェクト指向設計における5つの基本原則です。保守性が高く、拡張しやすいコードを書くための指針となります。

### S: 単一責任の原則（Single Responsibility Principle）

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

---

### O: 開放閉鎖の原則（Open-Closed Principle）

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

---

### L: リスコフの置換原則（Liskov Substitution Principle）

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

---

### I: インターフェース分離の原則（Interface Segregation Principle）

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

---

### D: 依存性逆転の原則（Dependency Inversion Principle）

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

---

## DRY原則（Don't Repeat Yourself）

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

---

## KISS原則（Keep It Simple, Stupid）

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

---

## YAGNI原則（You Aren't Gonna Need It）

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

## 関連リンク

- [基本原則](./01-basic-principles.md) - 型安全性と単一責任
- [リーダブルコード原則](./03-readable-code.md) - 読みやすいコードの書き方
- [Next.js開発ベストプラクティス](./04-nextjs-best-practices.md)
