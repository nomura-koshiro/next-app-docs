# ストーリーの作成

Storybookストーリーの基本的な書き方と実践的なパターン

## 📋 目次

- [基本的なStoryの書き方](#基本的なstoryの書き方)
- [コンポーネント階層](#コンポーネント階層)
- [複数バリアントの表示](#複数バリアントの表示)
- [フォームコンポーネント](#フォームコンポーネント)
- [インタラクションテスト](#インタラクションテスト)

---

## 基本的なStoryの書き方

### ストーリーファイルの構造

Storybookのストーリーは以下の構造で作成します：

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

// meta定義
const meta = {
  title: 'components/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ストーリー定義
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};
```

### meta定義の主要プロパティ

| プロパティ   | 説明                   | 例                                   |
| ------------ | ---------------------- | ------------------------------------ |
| `title`      | ナビゲーション階層     | `"components/ui/Button"`             |
| `component`  | 表示するコンポーネント | `Button`                             |
| `parameters` | 表示設定               | `{ layout: "centered" }`             |
| `tags`       | 自動ドキュメント生成   | `["autodocs"]`                       |
| `argTypes`   | コントロールパネル設定 | `{ variant: { control: "select" } }` |
| `args`       | デフォルト値           | `{ children: "Button" }`             |

---

## コンポーネント階層

### title による階層構造

`title`プロパティでStorybookのナビゲーション階層を定義します：

```typescript
// UIコンポーネント
title: 'components/ui/Button';
// → Components > UI > Button

// レイアウトコンポーネント
title: 'components/layout/PageHeader';
// → Components > Layout > PageHeader

// Featureコンポーネント
title: 'features/sample-users/routes/users/Users';
// → Features > Sample Users > Routes > Users > Users
```

### 階層のベストプラクティス

**推奨される階層:**

```text
components/
├── ui/              # 汎用UIコンポーネント
├── layout/          # レイアウトコンポーネント
└── errors/          # エラーコンポーネント

features/
└── {feature-name}/
    ├── components/  # Feature固有コンポーネント
    └── routes/      # ページコンポーネント
```

**例:**

```typescript
// ボタンコンポーネント
title: 'components/ui/Button';

// ユーザー一覧ページ
title: 'features/sample-users/routes/users/Users';

// ユーザーフォーム（共有コンポーネント）
title: 'features/sample-users/components/UserForm';
```

---

## 複数バリアントの表示

### 基本的なバリアント

```typescript
export const Primary: Story = {
  name: 'プライマリ',
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  name: 'セカンダリ',
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  name: 'アウトライン',
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};
```

### サイズバリアント

```typescript
export const Small: Story = {
  name: '小サイズ',
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  name: '中サイズ',
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  name: '大サイズ',
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};
```

### 状態バリアント

```typescript
export const Disabled: Story = {
  name: "無効状態",
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const Loading: Story = {
  name: "ローディング中",
  args: {
    loading: true,
    children: "Loading...",
  },
};

export const WithIcon: Story = {
  name: "アイコン付き",
  args: {
    children: (
      <>
        <Icon name="check" />
        Button with Icon
      </>
    ),
  },
};
```

---

## フォームコンポーネント

### React Hook Form との統合

フォームコンポーネントのストーリーでは、decoratorを使用してReact Hook Formをセットアップします：

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserForm } from "./user-form";
import { userFormSchema } from "./user-form.schema";

const meta = {
  title: "features/sample-users/components/UserForm",
  component: UserForm,

  decorators: [
    (Story, context) => {
      const { control, formState, handleSubmit } = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: context.args.defaultValues || {},
      });

      return (
        <Story
          args={{
            ...context.args,
            control,
            errors: formState.errors,
            onSubmit: handleSubmit(context.args.onSubmit || (() => {})),
          }}
        />
      );
    },
  ],
} satisfies Meta<typeof UserForm>;
```

### フォームストーリーの例

```typescript
export const Empty: Story = {
  name: '空の状態',
  args: {
    defaultValues: {},
    onSubmit: fn(),
    onCancel: fn(),
  },
};

export const WithData: Story = {
  name: 'データ入力済み',
  args: {
    defaultValues: {
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user',
    },
    onSubmit: fn(),
    onCancel: fn(),
  },
};

export const EditMode: Story = {
  name: '編集モード',
  args: {
    defaultValues: {
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'admin',
    },
    isEditMode: true,
    onSubmit: fn(),
    onCancel: fn(),
  },
};
```

---

## インタラクションテスト

### play関数の基本

`play`関数を使用して、ユーザーインタラクションを自動テストできます：

```typescript
import { expect, within, userEvent } from '@storybook/test';

export const ClickTest: Story = {
  name: 'クリックテスト',
  args: {
    children: 'Click Me',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // ボタンを見つける
    const button = canvas.getByRole('button', { name: /click me/i });

    // ボタンが表示されているか確認
    await expect(button).toBeInTheDocument();

    // ボタンをクリック
    await userEvent.click(button);

    // onClickが呼ばれたか確認
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

### フォーム入力テスト

```typescript
export const FormSubmitTest: Story = {
  name: 'フォーム送信テスト',
  args: {
    onSubmit: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Formフィールドを見つける
    const nameInput = canvas.getByLabelText(/名前/i);
    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    const submitButton = canvas.getByRole('button', { name: /作成/i });

    // Formに入力
    await userEvent.type(nameInput, '山田太郎');
    await userEvent.type(emailInput, 'yamada@example.com');

    // 送信ボタンをクリック
    await userEvent.click(submitButton);

    // onSubmitが呼ばれたか確認
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

### 条件分岐のテスト

```typescript
export const ErrorStateTest: Story = {
  name: 'エラー状態テスト',
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 送信ボタンをクリック（空の状態）
    const submitButton = canvas.getByRole('button', { name: /作成/i });
    await userEvent.click(submitButton);

    // エラーメッセージが表示されるか確認
    const errorMessage = await canvas.findByText(/必須です/i);
    await expect(errorMessage).toBeInTheDocument();

    // onSubmitは呼ばれていないはず
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
```

### 非同期処理のテスト

```typescript
export const LoadingTest: Story = {
  name: 'ローディングテスト',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ローディングスピナーが表示されているか確認
    const spinner = canvas.getByTestId('loading-spinner');
    await expect(spinner).toBeInTheDocument();

    // データが読み込まれるまで待機
    const content = await canvas.findByText(/データ/i, {}, { timeout: 3000 });
    await expect(content).toBeInTheDocument();

    // ローディングスピナーが消えたか確認
    await expect(spinner).not.toBeInTheDocument();
  },
};
```

---

## ベストプラクティス

### 1. ストーリーの命名

```typescript
// ✅ Good: わかりやすい日本語名
export const Primary: Story = {
  name: 'プライマリ',
  // ...
};

// ❌ Bad: exportキーだけ
export const Primary: Story = {
  // name プロパティがない
};
```

### 2. argsの使用

```typescript
// ✅ Good: argsで値を渡す
export const WithText: Story = {
  args: {
    children: "Button Text",
  },
};

// ❌ Bad: 直接propsを定義
export const WithText: Story = {
  render: () => <Button>Button Text</Button>,
};
```

### 3. parameters.docs.description

```typescript
export const Primary: Story = {
  name: 'プライマリ',
  args: {
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'プライマリボタンのデフォルト状態。重要なアクションに使用します。',
      },
    },
  },
};
```

---

## 次のステップ

- **[アドオンの活用](./03-addons.md)** - Controls、Actions、Viewportなどのアドオンを活用
- **[Storybookテンプレート](./04-templates.md)** - テンプレートを使った効率的なストーリー作成
- **[ベストプラクティス](./07-best-practices.md)** - より実践的なストーリーの書き方

---

## 参考リンク

- [Storybook公式: Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Storybook公式: Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Testing Library: Queries](https://testing-library.com/docs/queries/about)
