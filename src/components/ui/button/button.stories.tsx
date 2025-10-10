import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

/**
 * ボタンコンポーネントのストーリー
 *
 * shadcn/uiベースの再利用可能なボタンコンポーネント。
 * 複数のバリエーションとサイズをサポートします。
 */
const meta = {
  title: "components/ui/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "ボタンのバリエーション",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "ボタンのサイズ",
    },
    asChild: {
      control: "boolean",
      description: "Slotとして動作するかどうか",
    },
    disabled: {
      control: "boolean",
      description: "無効化状態",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのボタン
 */
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

/**
 * 破壊的なアクション用のボタン
 */
export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

/**
 * アウトラインボタン
 */
export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

/**
 * セカンダリボタン
 */
export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

/**
 * ゴーストボタン
 */
export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

/**
 * リンクボタン
 */
export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

/**
 * 小サイズのボタン
 */
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

/**
 * 大サイズのボタン
 */
export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

/**
 * アイコンボタン
 */
export const Icon: Story = {
  args: {
    children: "🔔",
    size: "icon",
  },
};

/**
 * 無効化されたボタン
 */
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

/**
 * すべてのバリエーションを表示
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

/**
 * すべてのサイズを表示
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔔</Button>
    </div>
  ),
};

/**
 * ローディング状態のボタン
 */
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <svg
        className="animate-spin h-4 w-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading...
    </Button>
  ),
};

/**
 * アイコン付きボタン
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Item
      </Button>
      <Button variant="outline">
        Download
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </Button>
    </div>
  ),
};
