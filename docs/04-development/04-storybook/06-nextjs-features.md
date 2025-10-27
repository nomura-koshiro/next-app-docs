# Next.js特有の機能

StorybookでNext.js特有の機能を扱う方法

## 📋 目次

- [Image コンポーネント](#image-コンポーネント)
- [Next.js Link コンポーネント](#link-コンポーネント)
- [Router のモック](#router-のモック)
- [Server Components の扱い](#server-components-の扱い)
- [フォント設定](#フォント設定)
- [AppProvider設定](#appprovider設定)
- [MSW統合](#msw統合)

---

## Image コンポーネント

Next.jsの`next/image`コンポーネントはStorybookでそのまま使用できます。

### 基本的な使い方

```typescript
import Image from "next/image";

export const WithImage: Story = {
  render: () => (
    <div>
      <Image
        src="/images/sample.jpg"
        alt="サンプル画像"
        width={400}
        height={300}
      />
    </div>
  ),
};
```

### ローカル画像の使用

```typescript
import sampleImage from "@/public/images/sample.jpg";

export const LocalImage: Story = {
  render: () => (
    <Image
      src={sampleImage}
      alt="ローカル画像"
      placeholder="blur"
    />
  ),
};
```

### レスポンシブ画像

```typescript
export const ResponsiveImage: Story = {
  render: () => (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <Image
        src="/images/hero.jpg"
        alt="ヒーロー画像"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  ),
};
```

---

## Link コンポーネント

Next.jsの`next/link`コンポーネントは、Storybookで自動的にモック化されます。

### 基本的な使い方

```typescript
import Link from "next/link";

export const WithLink: Story = {
  render: () => (
    <div>
      <Link href="/users">ユーザー一覧</Link>
      <Link href="/settings">設定</Link>
    </div>
  ),
};
```

### アクティブリンクの表示

```typescript
import { usePathname } from "next/navigation";

export const ActiveLink: Story = {
  render: () => {
    const pathname = usePathname();

    return (
      <nav>
        <Link
          href="/home"
          className={pathname === "/home" ? "active" : ""}
        >
          ホーム
        </Link>
        <Link
          href="/about"
          className={pathname === "/about" ? "active" : ""}
        >
          About
        </Link>
      </nav>
    );
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/home", // 現在のパスを設定
      },
    },
  },
};
```

---

## Router のモック

Next.jsのルーター機能をStorybookでモックする方法

### useRouter のモック

```typescript
import { useRouter } from "next/navigation";

export const WithRouter: Story = {
  render: () => {
    const router = useRouter();

    return (
      <button onClick={() => router.push("/dashboard")}>
        ダッシュボードへ
      </button>
    );
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn(), // router.push をモック
        pathname: "/",
      },
    },
  },
};
```

### ルートパラメータのモック

```typescript
export const WithParams: Story = {
  render: () => {
    const params = { id: "123" };

    return (
      <div>
        <h1>ユーザーID: {params.id}</h1>
      </div>
    );
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/users/[id]",
        query: { id: "123" },
      },
    },
  },
};
```

### useSearchParams のモック

```typescript
import { useSearchParams } from "next/navigation";

export const WithSearchParams: Story = {
  render: () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";

    return <div>現在のページ: {page}</div>;
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/users",
        search: "?page=2&sort=name",
      },
    },
  },
};
```

---

## Server Components の扱い

Next.js App RouterのServer Componentsは、Storybookでは通常のコンポーネントとして扱います。

### データフェッチのモック

Server Componentsのデータフェッチをモック化：

```typescript
// Server Component (async function)
async function UserList() {
  const users = await getUsers(); // サーバーサイドで実行
  return <div>{users.map(...)}</div>;
}

// Storybook用にClient Componentに変換
"use client";

export const UserListStory: Story = {
  render: () => {
    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];

    return (
      <div>
        {mockUsers.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  },
};
```

### Client Component境界

```typescript
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />; // Client Componentに渡す
}

// components/user-list.tsx (Client Component)
"use client";

export function UserList({ users }: { users: User[] }) {
  return <div>{users.map(...)}</div>;
}

// Storybook
export const UserListStory: Story = {
  args: {
    users: [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ],
  },
};
```

---

## フォント設定

Next.jsのフォント最適化機能をStorybookで使用する方法

### Google Fontsの使用

```typescript
// .storybook/preview.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const decorators = [
  (Story) => (
    <div className={inter.className}>
      <Story />
    </div>
  ),
];
```

### カスタムフォントの使用

```typescript
// .storybook/preview.tsx
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/my-font.woff2",
});

export const decorators = [
  (Story) => (
    <div className={myFont.className}>
      <Story />
    </div>
  ),
];
```

---

## AppProvider設定

アプリケーション全体のProviderをStorybookで設定する方法

### 基本的なProvider設定

```typescript
// .storybook/preview.tsx
import { AppProvider } from "@/providers/app-provider";

export const decorators = [
  (Story) => (
    <AppProvider>
      <Story />
    </AppProvider>
  ),
];
```

### 複数Providerの組み合わせ

```typescript
// .storybook/preview.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

export const decorators = [
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  ),
];
```

### ストーリー固有のProvider

```typescript
export const WithAuth: Story = {
  decorators: [
    (Story) => (
      <AuthProvider initialUser={{ id: "1", name: "Test User" }}>
        <Story />
      </AuthProvider>
    ),
  ],
};
```

---

## MSW統合

Mock Service Worker（MSW）を使用してAPIリクエストをモック化

### 基本的なセットアップ

MSWは既にプロジェクトにセットアップされています：

```typescript
// .storybook/preview.tsx
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

export const loaders = [mswLoader];
```

### APIモックの基本

```typescript
import { http, HttpResponse } from 'msw';

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/sample/users', () => {
          return HttpResponse.json({
            data: [
              { id: '1', name: 'User 1', email: 'user1@example.com' },
              { id: '2', name: 'User 2', email: 'user2@example.com' },
            ],
          });
        }),
      ],
    },
  },
};
```

### ローディング状態のモック

```typescript
import { delay } from 'msw';

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/sample/users', async () => {
          await delay(5000); // 5秒待機
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};
```

### エラー状態のモック

```typescript
export const WithError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/sample/users', () => {
          return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }),
      ],
    },
  },
};
```

### 複数エンドポイントのモック

```typescript
export const Complete: Story = {
  parameters: {
    msw: {
      handlers: [
        // ユーザー一覧
        http.get('/api/v1/sample/users', () => {
          return HttpResponse.json({
            data: mockUsers,
          });
        }),
        // ユーザー詳細
        http.get('/api/v1/sample/users/:id', ({ params }) => {
          const user = mockUsers.find((u) => u.id === params.id);
          return HttpResponse.json({ data: user });
        }),
        // ユーザー作成
        http.post('/api/v1/sample/users', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ data: { id: 'new-id', ...body } }, { status: 201 });
        }),
      ],
    },
  },
};
```

### POSTリクエストのテスト

```typescript
export const CreateUser: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/sample/users', async ({ request }) => {
          const body = await request.json();

          // バリデーション
          if (!body.name || !body.email) {
            return HttpResponse.json({ message: 'Validation Error' }, { status: 400 });
          }

          return HttpResponse.json({ data: { id: 'new-id', ...body } }, { status: 201 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Formに入力
    await userEvent.type(canvas.getByLabelText(/名前/i), 'New User');
    await userEvent.type(canvas.getByLabelText(/メール/i), 'new@example.com');

    // 送信
    await userEvent.click(canvas.getByRole('button', { name: /作成/i }));

    // 成功メッセージを確認
    await expect(canvas.findByText(/作成しました/i)).resolves.toBeInTheDocument();
  },
};
```

---

## ベストプラクティス

### 1. 環境変数の使用

```typescript
// .storybook/preview.tsx
if (process.env.STORYBOOK_API_URL) {
  // Storybook用のAPI URLを設定
}
```

### 2. パスエイリアスの設定

```typescript
// .storybook/main.ts
export default {
  viteFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
    };
    return config;
  },
};
```

### 3. 静的アセットの配置

```text
public/
├── images/
├── fonts/
└── icons/
```

Storybookから`/images/sample.jpg`でアクセス可能

---

## 次のステップ

- **[ベストプラクティス](./07-best-practices.md)** - Next.jsとStorybookの効率的な使い方
- **[Storybookテンプレート](./04-templates.md)** - Next.js対応のテンプレート
- **[Plop統合](./05-plop-integration.md)** - 自動コード生成

---

## 参考リンク

- [Storybook for Next.js](https://storybook.js.org/docs/get-started/nextjs)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [MSW Documentation](https://mswjs.io/)
- [Next.js App Router](https://nextjs.org/docs/app)
