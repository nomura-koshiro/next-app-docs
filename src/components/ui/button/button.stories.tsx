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
  name: "デフォルト",
  args: {
    children: "ボタン",
    variant: "default",
    size: "default",
  },
};

/**
 * 破壊的なアクション用のボタン（削除など）
 */
export const Destructive: Story = {
  name: "破壊的アクション",
  args: {
    children: "削除",
    variant: "destructive",
  },
};

/**
 * アウトラインスタイル
 */
export const Outline: Story = {
  name: "アウトライン",
  args: {
    children: "アウトライン",
    variant: "outline",
  },
};

/**
 * セカンダリスタイル
 */
export const Secondary: Story = {
  name: "セカンダリ",
  args: {
    children: "セカンダリ",
    variant: "secondary",
  },
};

/**
 * ゴーストスタイル（背景なし）
 */
export const Ghost: Story = {
  name: "ゴースト",
  args: {
    children: "ゴースト",
    variant: "ghost",
  },
};

/**
 * リンクスタイル
 */
export const Link: Story = {
  name: "リンク",
  args: {
    children: "リンク",
    variant: "link",
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  name: "小サイズ",
  args: {
    children: "小",
    size: "sm",
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  name: "大サイズ",
  args: {
    children: "大",
    size: "lg",
  },
};

/**
 * アイコンのみ
 */
export const Icon: Story = {
  name: "アイコン",
  args: {
    children: "🔔",
    size: "icon",
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  name: "無効化",
  args: {
    children: "無効化",
    disabled: true,
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  name: "ローディング",
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
      読み込み中...
    </Button>
  ),
};

/**
 * アイコンとテキストの組み合わせ
 */
export const WithIcon: Story = {
  name: "アイコン付き",
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
        項目を追加
      </Button>
      <Button variant="outline">
        ダウンロード
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
