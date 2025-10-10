# MSW (Mock Service Worker) セットアップ

このドキュメントでは、プロジェクトにおけるMSW（Mock Service Worker）の設定と使用方法を説明します。

## 目次

1. [概要](#概要)
2. [MSWProviderの実装](#mswproviderの実装)
3. [環境変数の設定](#環境変数の設定)
4. [モックハンドラーの作成](#モックハンドラーの作成)
5. [使用方法](#使用方法)
6. [トラブルシューティング](#トラブルシューティング)

---

## 概要

### MSWとは？

MSW (Mock Service Worker) は、Service Workerを使用してAPIリクエストをインターセプトし、モックレスポンスを返すライブラリです。

### MSWの利点

| 利点 | 説明 |
|------|------|
| **バックエンド不要** | APIサーバーなしでフロントエンド開発が可能 |
| **リアルなネットワーク動作** | 実際のHTTPリクエストをモック |
| **開発効率の向上** | バックエンドの実装を待たずに開発可能 |
| **テストの信頼性** | E2Eテストでも同じモックを使用 |
| **デバッグの簡易化** | ブラウザのDevToolsでリクエストを確認可能 |

### プロジェクトでの使用目的

- 開発環境でのAPIモック
- Storybookでのコンポーネント開発
- E2Eテスト（Playwright）
- 統合テスト（Vitest）

---

## MSWProviderの実装

### 完全な実装

```typescript
// src/lib/msw.tsx
'use client';

import { useEffect, useState } from 'react';
import { env } from '@/config/env';

/**
 * MSW (Mock Service Worker) Provider
 *
 * 開発環境でAPIモックを有効にするためのプロバイダーコンポーネント。
 * env.ENABLE_API_MOCKING=trueの場合のみMSWを初期化します。
 *
 * @example
 * ```tsx
 * // layout.tsxで使用
 * <MSWProvider>
 *   <YourApp />
 * </MSWProvider>
 * ```
 */
export const MSWProvider = ({ children }: { children: React.ReactNode }): React.ReactElement | null => {
  // MSWの初期化が完了したかどうかを管理
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /**
     * MSWを初期化する非同期関数
     * - ブラウザ環境でのみ実行
     * - env.ENABLE_API_MOCKING=trueの場合のみService Workerを起動
     */
    const initMSW = async (): Promise<void> => {
      if (typeof window !== 'undefined' && env.ENABLE_API_MOCKING === true) {
        // MSW workerを動的にインポート（本番環境でのバンドルサイズ削減）
        const { worker } = await import('@/mocks/browser');

        // Service Workerを起動
        // onUnhandledRequest: 'bypass' - モックされていないリクエストは通常通り処理
        await worker.start({
          onUnhandledRequest: 'bypass',
        });

        console.log('[MSW] Mock Service Worker initialized');
      }

      // 初期化完了をマーク（モッキング無効時も即座に完了）
      setIsReady(true);
    };

    void initMSW();
  }, []);

  // MSWが有効で初期化未完了の場合は何も表示しない
  // これにより、MSW起動前のAPIリクエストを防ぐ
  if (!isReady && env.ENABLE_API_MOCKING === true) {
    return null;
  }

  return <>{children}</>;
};
```

### コードの構造

```
MSWProvider
├── useState(isReady)           MSW初期化状態の管理
├── useEffect                   MSW初期化処理
│   └── initMSW()
│       ├── 環境チェック        ブラウザ & ENABLE_API_MOCKING
│       ├── worker インポート   動的インポート
│       └── worker.start()     Service Worker起動
└── 条件付きレンダリング        初期化完了まで待機
```

### 重要なポイント

#### 1. クライアントコンポーネント

```typescript
'use client';
```

MSWはブラウザのService Workerを使用するため、クライアントコンポーネントとして実装します。

#### 2. 動的インポート

```typescript
const { worker } = await import('@/mocks/browser');
```

**理由:**
- 本番環境でMSW関連のコードがバンドルされるのを防ぐ
- 開発環境でのみMSWをロード

#### 3. 初期化完了の待機

```typescript
if (!isReady && env.ENABLE_API_MOCKING === true) {
  return null;
}
```

**理由:**
- MSW起動前にAPIリクエストが発行されるのを防ぐ
- モックが適用されないリクエストを防止

#### 4. onUnhandledRequest: 'bypass'

```typescript
await worker.start({
  onUnhandledRequest: 'bypass',
});
```

**オプション:**

| 値 | 動作 |
|----|------|
| `'bypass'` | モックされていないリクエストは通常通り処理（推奨） |
| `'warn'` | 警告を出力し、リクエストを処理 |
| `'error'` | エラーを出力し、リクエストを処理 |

---

## 環境変数の設定

### .env.local

```bash
# .env.local

# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

### env.tsでの検証

```typescript
// src/config/env.ts
const EnvSchema = z.object({
  ENABLE_API_MOCKING: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional(),
});
```

### MSWの有効/無効切り替え

```bash
# MSWを有効化
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# MSWを無効化
NEXT_PUBLIC_ENABLE_API_MOCKING=false
```

---

## モックハンドラーの作成

### ディレクトリ構造

```
src/mocks/
├── browser.ts         ブラウザ用のworker設定
├── handlers.ts        モックハンドラー定義
└── server.ts          Node.js用のserver設定（テスト用）
```

### browser.ts

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### handlers.ts

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // ユーザー一覧取得
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  // 特定ユーザー取得
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  }),

  // ユーザー作成
  http.post('/api/users', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(
      {
        id: '3',
        ...data,
      },
      { status: 201 }
    );
  }),

  // ユーザー更新
  http.patch('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();
    return HttpResponse.json({
      id,
      ...data,
    });
  }),

  // ユーザー削除
  http.delete('/api/users/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
```

### server.ts（テスト用）

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

## 使用方法

### 1. レイアウトに追加

```typescript
// src/app/layout.tsx
import { MSWProvider } from '@/lib/msw';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <MSWProvider>
          {children}
        </MSWProvider>
      </body>
    </html>
  );
}
```

### 2. 開発サーバー起動

```bash
npm run dev
```

**ブラウザのコンソールに表示:**

```
[MSW] Mock Service Worker initialized
```

### 3. APIリクエストの確認

```typescript
// src/features/users/components/user-list.tsx
'use client';

import { useUsers } from '../api/queries';

export const UserList = () => {
  const { data: users } = useUsers();

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

**ブラウザのNetwork タブで確認:**

```
GET /api/users
Status: 200 OK (from service worker)
```

---

## 高度な使用方法

### 1. エラーレスポンスのモック

```typescript
// src/mocks/handlers.ts
http.get('/api/users/:id', ({ params }) => {
  const { id } = params;

  // 存在しないユーザー
  if (id === '999') {
    return HttpResponse.json(
      { message: 'User not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json({
    id,
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

### 2. 遅延レスポンス（ローディング状態のテスト）

```typescript
import { delay, http, HttpResponse } from 'msw';

http.get('/api/users', async () => {
  await delay(2000);  // 2秒遅延

  return HttpResponse.json([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
  ]);
});
```

### 3. 動的レスポンス

```typescript
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

export const handlers = [
  // ユーザー一覧取得
  http.get('/api/users', () => {
    return HttpResponse.json(users);
  }),

  // ユーザー作成
  http.post('/api/users', async ({ request }) => {
    const data = await request.json();
    const newUser = {
      id: String(users.length + 1),
      ...data,
    };
    users.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // ユーザー削除
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    users = users.filter((user) => user.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
```

### 4. 条件付きレスポンス

```typescript
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');

  const filteredUsers = search
    ? users.filter((user) => user.name.includes(search))
    : users;

  return HttpResponse.json(filteredUsers);
});
```

---

## Storybookでの使用

### .storybook/preview.ts

```typescript
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../src/mocks/handlers';

// MSWを初期化
initialize({
  onUnhandledRequest: 'bypass',
});

export const loaders = [mswLoader];

export const parameters = {
  msw: {
    handlers,
  },
};
```

### ストーリーでのカスタムハンドラー

```typescript
// src/features/users/components/user-list.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { UserList } from './user-list';

const meta: Meta<typeof UserList> = {
  component: UserList,
};

export default meta;
type Story = StoryObj<typeof UserList>;

// デフォルトのハンドラーを使用
export const Default: Story = {};

// カスタムハンドラー
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};
```

---

## テストでの使用

### Vitest セットアップ

```typescript
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/server';

// テスト開始前にMSWサーバーを起動
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// 各テスト後にハンドラーをリセット
afterEach(() => {
  server.resetHandlers();
});

// すべてのテスト終了後にMSWサーバーを停止
afterAll(() => {
  server.close();
});
```

### テストコード

```typescript
// src/features/users/components/user-list.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { UserList } from './user-list';

test('ユーザー一覧を表示', async () => {
  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

test('エラー時のメッセージを表示', async () => {
  // このテストのみカスタムハンドラーを使用
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json(
        { message: 'Server Error' },
        { status: 500 }
      );
    })
  );

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
  });
});
```

---

## トラブルシューティング

### MSWが起動しない

**症状:** コンソールに `[MSW] Mock Service Worker initialized` が表示されない

**原因と解決策:**

1. **環境変数が設定されていない**
   ```bash
   # .env.local
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. **開発サーバーを再起動していない**
   ```bash
   # サーバーを停止（Ctrl+C）して再起動
   npm run dev
   ```

3. **MSWProviderが配置されていない**
   ```typescript
   // layout.tsx
   <MSWProvider>
     {children}
   </MSWProvider>
   ```

### Service Workerの登録エラー

**エラーメッセージ:**
```
[MSW] Failed to register Service Worker
```

**解決策:**

1. **public/mockServiceWorker.js が存在するか確認**
   ```bash
   ls public/mockServiceWorker.js
   ```

2. **ファイルが存在しない場合、生成**
   ```bash
   npx msw init public/ --save
   ```

### モックが適用されない

**症状:** 実際のAPIにリクエストが送信される

**原因と解決策:**

1. **ハンドラーのURLが間違っている**
   ```typescript
   // ❌ Bad
   http.get('users', ...)  // 相対パス

   // ✅ Good
   http.get('/api/users', ...)  // 絶対パス
   ```

2. **baseURLとの整合性**
   ```typescript
   // env.API_URL が '/api' の場合
   http.get('/api/users', ...)  // ✅ 正しい
   http.get('/users', ...)      // ❌ マッチしない
   ```

---

## ベストプラクティス

### 1. ハンドラーをfeatureごとに分割

```typescript
// src/mocks/handlers/users.ts
export const userHandlers = [
  http.get('/api/users', () => { ... }),
  http.post('/api/users', () => { ... }),
];

// src/mocks/handlers/posts.ts
export const postHandlers = [
  http.get('/api/posts', () => { ... }),
];

// src/mocks/handlers.ts
import { userHandlers } from './handlers/users';
import { postHandlers } from './handlers/posts';

export const handlers = [...userHandlers, ...postHandlers];
```

### 2. 型安全なモックデータ

```typescript
import type { User } from '@/features/users/types';

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

http.get('/api/users', () => {
  return HttpResponse.json(mockUsers);
});
```

### 3. エラーケースのテスト

```typescript
// 正常系
export const Default: Story = {};

// 空データ
export const Empty: Story = {
  parameters: { msw: { handlers: [emptyHandler] } },
};

// エラー
export const Error: Story = {
  parameters: { msw: { handlers: [errorHandler] } },
};

// ローディング
export const Loading: Story = {
  parameters: { msw: { handlers: [loadingHandler] } },
};
```

---

## 参考リンク

### プロジェクト内ドキュメント

- [環境変数管理](../03-core-concepts/04-environment-variables.md) - ENABLE_API_MOCKINGの設定
- [API統合](../03-core-concepts/03-api-integration.md) - APIクライアントとの連携

### 外部リンク

- [MSW公式ドキュメント](https://mswjs.io/)
- [MSW - Getting Started](https://mswjs.io/docs/getting-started)
- [MSW - Storybook Addon](https://storybook.js.org/addons/msw-storybook-addon)
- [bulletproof-react - MSW](https://github.com/alan2207/bulletproof-react)
