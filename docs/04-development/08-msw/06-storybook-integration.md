# Storybookとの統合

このプロジェクトでは、Storybook内でMSWを**AppProvider経由**で使用します。

---

## preview.tsでの設定

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import { AppProvider } from '../src/app/provider'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
}

export default preview
```

---

## 仕組み

### 1. AppProviderにMSWProviderが含まれている

```typescript
// src/app/provider.tsx
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MSWProvider>  {/* ← MSWProviderが含まれている */}
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </MSWProvider>
  )
}
```

### 2. 環境変数でMSWを有効化

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

### 3. すべてのStoryで自動的にMSWが動作

- Story単位でハンドラーをオーバーライドする必要なし
- `src/mocks/handlers.ts`で定義したグローバルハンドラーを使用

---

## Storyの作成例

### 基本的なStory

```typescript
// src/features/users/components/user-list.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserList } from './user-list';

const meta = {
  title: 'Features/Users/UserList',
  component: UserList,
  tags: ['autodocs'],
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー（グローバルハンドラーを使用）
export const Default: Story = {};
```

**動作:**

- `src/mocks/handlers/api/v1/user-handlers.ts`で定義したハンドラーが自動適用
- 特別な設定不要

---

## ハンドラーのオーバーライド（必要な場合）

特定のStoryで異なるレスポンスを返したい場合は、`parameters.msw.handlers`でオーバーライドできます。

### 空データのStory

```typescript
import { http, HttpResponse } from 'msw';

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};
```

### エラー状態のStory

```typescript
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', () => {
          return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }),
      ],
    },
  },
};
```

### ローディング状態のStory

```typescript
import { delay } from 'msw';

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', async () => {
          await delay('infinite'); // 無限ローディング
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};
```

---

## 完全な例

```typescript
// src/features/users/components/user-list.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';
import { UserList } from './user-list';

const meta = {
  title: 'Features/Users/UserList',
  component: UserList,
  tags: ['autodocs'],
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト（グローバルハンドラーを使用）
export const Default: Story = {};

// 空データ
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};

// エラー
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', () => {
          return HttpResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }),
      ],
    },
  },
};

// ローディング
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', async () => {
          await delay('infinite');
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};

// 大量データ
export const ManyUsers: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/users', () => {
          const users = Array.from({ length: 100 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
          }));
          return HttpResponse.json({ data: users });
        }),
      ],
    },
  },
};
```

---

## 利点

### 1. 設定がシンプル

- `msw-storybook-addon`不要
- AppProviderを追加するだけ

### 2. 保守性が高い

- AppProviderの変更がStorybookにも自動反映
- 一元管理

### 3. 動作が統一

- アプリとStorybookで同じ挙動
- 同じハンドラーを共有

---

## デバッグ

### MSWが動作しているか確認

1. Storybookを起動

   ```bash
   pnpm storybook
   ```

2. ブラウザのコンソールを開く

3. 以下のメッセージを確認

   ```text
   [MSW] Mock Service Worker initialized
   [MSW] Registered handlers: 10
   ```

### ハンドラーが適用されているか確認

1. Storybookを開く
2. Network Tabを開く
3. APIリクエストを確認
4. Responseがモックデータになっているか確認

---

## トラブルシューティング

### Storybookでモックが動かない

**症状:** 実際のAPIリクエストが発生してしまう

**解決策:**

1. **環境変数の確認**

   ```bash
   # .env.local
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. **Storybookの再起動**

   ```bash
   # Storybookを停止（Ctrl+C）して再起動
   pnpm storybook
   ```

3. **preview.tsの確認**

   ```typescript
   // .storybook/preview.ts
   import { AppProvider } from '../src/app/provider'

   const preview: Preview = {
     decorators: [
       (Story) => (
         <AppProvider>
           <Story />
         </AppProvider>
       ),
     ],
   }
   ```

### Storybook起動時にエラー

**症状:**

```text
Cannot find module '@/mocks/browser'
```

**解決策:**

1. `src/mocks/browser.ts`が存在するか確認
2. パスエイリアス（`@/`）が正しく設定されているか確認

---

## 次のステップ

Storybookとの統合が完了したら、次はテストとの統合方法を学びます。

1. **[テストとの統合](./07-testing-integration.md)** - Vitest、Playwrightでの使用
2. **[ベストプラクティス](./08-best-practices.md)** - MSW使用のベストプラクティス

---

## 関連リンク

- [Storybook](../06-storybook.md) - Storybookの詳細
- [MSWProviderの実装](./05-msw-provider.md) - MSWProviderの詳細
- [MSW公式 - Storybook](https://mswjs.io/docs/integrations/storybook) - 公式ドキュメント
