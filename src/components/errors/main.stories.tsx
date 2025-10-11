import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MainErrorFallback } from "./main";

const meta = {
  title: "components/errors/MainErrorFallback",
  component: MainErrorFallback,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MainErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのエラーフォールバック表示
 *
 * ErrorBoundaryでキャッチされたエラーが発生した際に
 * フルスクリーンで表示されるフォールバックUIです。
 * role="alert"が設定されており、スクリーンリーダー対応済みです。
 */
export const Default: Story = {
  name: "デフォルト",
};
