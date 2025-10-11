import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const meta = {
  title: "components/ui/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "アラートのバリエーション",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのアラート
 */
export const Default: Story = {
  name: "デフォルト",
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>情報</AlertTitle>
      <AlertDescription>
        これはデフォルトのアラートメッセージです。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * 破壊的なアクション用のアラート
 */
export const Destructive: Story = {
  name: "破壊的",
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>エラー</AlertTitle>
      <AlertDescription>
        エラーが発生しました。もう一度お試しください。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * 成功メッセージ
 */
export const Success: Story = {
  name: "成功",
  render: () => (
    <Alert>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>成功</AlertTitle>
      <AlertDescription>操作が正常に完了しました。</AlertDescription>
    </Alert>
  ),
};

/**
 * タイトルのみのアラート
 */
export const TitleOnly: Story = {
  name: "タイトルのみ",
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>タイトルのみのアラート</AlertTitle>
    </Alert>
  ),
};

/**
 * 説明文のみのアラート
 */
export const DescriptionOnly: Story = {
  name: "説明文のみ",
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>説明文のみのアラート</AlertDescription>
    </Alert>
  ),
};

/**
 * アイコンなしのアラート
 */
export const WithoutIcon: Story = {
  name: "アイコンなし",
  render: () => (
    <Alert>
      <AlertTitle>アイコンなし</AlertTitle>
      <AlertDescription>アイコンを使用しないアラートです。</AlertDescription>
    </Alert>
  ),
};

