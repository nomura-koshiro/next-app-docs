import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingSpinner } from "./loading-spinner";

const meta = {
  title: "components/ui/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "表示するテキスト",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "スピナーのサイズ",
    },
    fullScreen: {
      control: "boolean",
      description: "フルスクリーン表示",
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのLoadingSpinner
 */
export const Default: Story = {
  name: "デフォルト",
  args: {},
};

/**
 * カスタムテキスト
 */
export const CustomText: Story = {
  name: "カスタムテキスト",
  args: {
    text: "データを読み込んでいます...",
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  name: "小",
  args: {
    size: "sm",
    text: "読み込み中...",
  },
};

/**
 * 中サイズ
 */
export const Medium: Story = {
  name: "中",
  args: {
    size: "md",
    text: "読み込み中...",
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  name: "大",
  args: {
    size: "lg",
    text: "読み込み中...",
  },
};

/**
 * テキストなし
 */
export const NoText: Story = {
  name: "テキストなし",
  args: {
    text: "",
  },
};

/**
 * フルスクリーン (Storybookでは表示が制限されます)
 */
export const FullScreen: Story = {
  name: "フルスクリーン",
  args: {
    fullScreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * カード内での使用例
 */
export const InCard: Story = {
  name: "カード内",
  render: () => (
    <div className="w-96 rounded-lg border bg-white p-8 shadow-sm">
      <LoadingSpinner text="データを取得中..." />
    </div>
  ),
};
