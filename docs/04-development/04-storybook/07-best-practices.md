# ベストプラクティス

Storybookを効果的に活用するための実践的なガイド

## 📋 目次

- [ファイル配置](#ファイル配置)
- [様々な状態のカバー](#様々な状態のカバー)
- [モックデータの作成](#モックデータの作成)
- [アクセシビリティ](#アクセシビリティ)
- [ドキュメント生成](#ドキュメント生成)
- [デコレーター活用](#デコレーター活用)

---

## ファイル配置

### コロケーション戦略

ストーリーファイルはコンポーネントと同じディレクトリに配置します：

```text
✅ Good: コロケーション
src/components/ui/button/
├── button.tsx
├── button.stories.tsx  # コンポーネントと同じ場所
└── index.ts

❌ Bad: 分離
src/
├── components/ui/button/
│   ├── button.tsx
│   └── index.ts
└── stories/
    └── button.stories.tsx  # 別の場所
```

### ディレクトリ構造

```text
src/
├── components/
│   ├── ui/                    # 汎用UIコンポーネント
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   └── index.ts
│   │   └── input/
│   │       ├── input.tsx
│   │       ├── input.stories.tsx
│   │       └── index.ts
│   └── layout/                # レイアウトコンポーネント
│       ├── page-header.tsx
│       └── page-header.stories.tsx
└── features/
    └── sample-users/
        ├── components/        # Feature共有コンポーネント
        │   ├── user-form.tsx
        │   └── user-form.stories.tsx
        └── routes/
            └── users/
                ├── users.tsx
                └── users.stories.tsx
```

### 命名規則

```typescript
// ✅ Good: 一貫した命名
button.tsx
button.stories.tsx

// ❌ Bad: 不一致な命名
Button.tsx
button.story.tsx
```

---

## 様々な状態のカバー

### 基本状態

すべてのコンポーネントで以下の状態をカバーします：

```typescript
// 1. デフォルト状態
export const Default: Story = {
  args: {},
};

// 2. プロパティのバリエーション
export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

// 3. インタラクティブな状態
export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

// 4. エッジケース
export const LongText: Story = {
  args: {
    children: "とても長いテキストがボタンに設定された場合の表示を確認します",
  },
};

export const Empty: Story = {
  args: {
    children: "",
  },
};
```

### データ駆動の状態

```typescript
// ページコンポーネントの状態
export const WithData: Story = {
  name: "データあり",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({ data: mockUsers });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", async () => {
          await delay(5000);
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};

export const WithError: Story = {
  name: "エラー",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

export const Empty: Story = {
  name: "空の状態",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
};
```

### レスポンシブ対応

```typescript
export const Mobile: Story = {
  name: "モバイル",
  parameters: {
    viewport: { defaultViewport: "iphone12" },
  },
};

export const Tablet: Story = {
  name: "タブレット",
  parameters: {
    viewport: { defaultViewport: "ipad" },
  },
};

export const Desktop: Story = {
  name: "デスクトップ",
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};
```

---

## モックデータの作成

### モックデータの分離

モックデータは専用ファイルで管理します：

```typescript
// src/mocks/user.ts
export const mockUser = {
  id: "1",
  name: "山田太郎",
  email: "yamada@example.com",
  role: "admin",
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockUsers = [
  mockUser,
  {
    id: "2",
    name: "鈴木花子",
    email: "suzuki@example.com",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
  },
];
```

```typescript
// button.stories.tsx
import { mockUsers } from "@/mocks/user";

export const WithUsers: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({ data: mockUsers });
        }),
      ],
    },
  },
};
```

### ファクトリー関数の活用

```typescript
// src/mocks/factories/user.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })
  );
}
```

```typescript
// stories
export const ManyUsers: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({
            data: createMockUsers(100), // 100件のユーザー
          });
        }),
      ],
    },
  },
};
```

---

## アクセシビリティ

### 基本チェックリスト

```typescript
const meta = {
  title: "components/ui/Button",
  component: Button,
  parameters: {
    // A11yチェックを有効化
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
          { id: "aria-allowed-attr", enabled: true },
        ],
      },
    },
  },
} satisfies Meta<typeof Button>;
```

### セマンティックHTML

```typescript
// ✅ Good: セマンティックなHTML
export const Accessible: Story = {
  render: () => (
    <nav aria-label="メインナビゲーション">
      <ul>
        <li><a href="/home">ホーム</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  ),
};

// ❌ Bad: 非セマンティック
export const Bad: Story = {
  render: () => (
    <div>
      <div onClick={() => {}}>ホーム</div>
      <div onClick={() => {}}>About</div>
    </div>
  ),
};
```

### ARIAラベルの使用

```typescript
export const WithAria: Story = {
  args: {
    "aria-label": "ユーザーを削除",
    "aria-describedby": "delete-description",
  },
  render: (args) => (
    <>
      <button {...args}>削除</button>
      <p id="delete-description">この操作は取り消せません</p>
    </>
  ),
};
```

### キーボードナビゲーション

```typescript
export const KeyboardNav: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Tabキーでフォーカス
    await userEvent.tab();
    await expect(button).toHaveFocus();

    // Enterキーで実行
    await userEvent.keyboard("{Enter}");
  },
};
```

---

## ドキュメント生成

### コンポーネントの説明

```typescript
/**
 * Buttonのストーリー
 *
 * プライマリ、セカンダリ、アウトラインなど複数のバリアントを提供します。
 */
const meta = {
  title: "components/ui/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "ボタンコンポーネント。様々なバリアント、サイズ、状態をサポートします。\n\n" +
          "**主な機能:**\n" +
          "- 複数のバリアント（primary、secondary、outline）\n" +
          "- サイズ調整（sm、md、lg）\n" +
          "- 無効・ローディング状態のサポート\n\n" +
          "**使用例:**\n" +
          "```tsx\n" +
          "<Button variant=\"primary\" size=\"md\" onClick={handleClick}>\n" +
          "  クリック\n" +
          "</Button>\n" +
          "```",
      },
    },
  },
} satisfies Meta<typeof Button>;
```

### ストーリーの説明

```typescript
export const Primary: Story = {
  name: "プライマリボタン",
  args: {
    variant: "primary",
    children: "Primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "プライマリボタンは、ページ内で最も重要なアクションに使用します。\n" +
          "例: フォーム送信、データ保存、次のステップへの遷移など",
      },
    },
  },
};
```

### argTypesの詳細化

```typescript
const meta = {
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description: "ボタンの視覚的なバリアント",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
        category: "スタイリング",
      },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "ボタンのサイズ",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
        category: "スタイリング",
      },
    },
    onClick: {
      action: "clicked",
      description: "ボタンクリック時のコールバック",
      table: {
        category: "イベント",
      },
    },
  },
} satisfies Meta<typeof Button>;
```

---

## デコレーター活用

### グローバルデコレーター

```typescript
// .storybook/preview.tsx
import { AppProvider } from "@/providers/app-provider";

export const decorators = [
  // すべてのストーリーに適用
  (Story) => (
    <AppProvider>
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    </AppProvider>
  ),
];
```

### コンポーネントレベルのデコレーター

```typescript
const meta = {
  title: "features/sample-users/components/UserForm",
  component: UserForm,
  decorators: [
    // このコンポーネントのすべてのストーリーに適用
    (Story) => (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserForm>;
```

### ストーリーレベルのデコレーター

```typescript
export const WithContext: Story = {
  decorators: [
    // このストーリーのみに適用
    (Story) => (
      <UserContext.Provider value={{ user: mockUser }}>
        <Story />
      </UserContext.Provider>
    ),
  ],
};
```

### 条件付きデコレーター

```typescript
const meta = {
  decorators: [
    (Story, context) => {
      const isDarkMode = context.args.theme === "dark";

      return (
        <div className={isDarkMode ? "dark" : "light"}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Button>;
```

---

## パフォーマンス最適化

### 遅延読み込み

```typescript
// ✅ Good: 動的インポート
const HeavyComponent = lazy(() => import("./heavy-component"));

export const WithHeavy: Story = {
  render: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  ),
};
```

### メモ化

```typescript
// ✅ Good: useMemoで最適化
export const Optimized: Story = {
  render: () => {
    const expensiveData = useMemo(() => {
      return processLargeData(mockData);
    }, []);

    return <DataTable data={expensiveData} />;
  },
};
```

---

## チーム開発のベストプラクティス

### 1. ストーリーの粒度

```typescript
// ✅ Good: 適切な粒度
export const Empty: Story = { /* 空の状態 */ };
export const WithData: Story = { /* データあり */ };
export const Loading: Story = { /* ローディング */ };
export const Error: Story = { /* エラー */ };

// ❌ Bad: 粗すぎる粒度
export const AllCases: Story = {
  /* すべてを1つに詰め込む */
};
```

### 2. 一貫した命名

```typescript
// ✅ Good: 日本語で統一
export const Default: Story = { name: "デフォルト" };
export const Loading: Story = { name: "ローディング中" };

// ❌ Bad: 混在
export const Default: Story = { name: "Default" };
export const Loading: Story = { name: "ローディング中" };
```

### 3. plopテンプレートの活用

```bash
# 一貫したストーリーを自動生成
pnpm generate:component
pnpm generate:feature
pnpm generate:route
```

---

## 次のステップ

- **[概要とセットアップ](./01-overview.md)** - Storybookの基本
- **[ストーリーの作成](./02-creating-stories.md)** - ストーリーの書き方
- **[Plop統合](./05-plop-integration.md)** - 自動コード生成

---

## 参考リンク

- [Storybook公式: Best Practices](https://storybook.js.org/docs/writing-stories/introduction)
- [Component Story Format 3.0](https://storybook.js.org/blog/component-story-format-3-0/)
- [Storybook公式: Accessibility](https://storybook.js.org/docs/writing-tests/accessibility-testing)
