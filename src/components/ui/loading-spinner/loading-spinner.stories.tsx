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
  args: {},
};

/**
 * カスタムテキスト
 */
export const CustomText: Story = {
  args: {
    text: "データを読み込んでいます...",
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  args: {
    size: "sm",
    text: "読み込み中...",
  },
};

/**
 * 中サイズ
 */
export const Medium: Story = {
  args: {
    size: "md",
    text: "読み込み中...",
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  args: {
    size: "lg",
    text: "読み込み中...",
  },
};

/**
 * テキストなし
 */
export const WithoutText: Story = {
  args: {
    text: "",
  },
};

/**
 * フルスクリーン (Storybookでは表示が制限されます)
 */
export const FullScreen: Story = {
  args: {
    fullScreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * すべてのサイズ
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm text-gray-600">Small</p>
        <LoadingSpinner size="sm" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Medium (Default)</p>
        <LoadingSpinner size="md" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Large</p>
        <LoadingSpinner size="lg" />
      </div>
    </div>
  ),
};

/**
 * カード内での使用例
 */
export const InCard: Story = {
  render: () => (
    <div className="w-96 rounded-lg border bg-white p-8 shadow-sm">
      <LoadingSpinner text="データを取得中..." />
    </div>
  ),
};
