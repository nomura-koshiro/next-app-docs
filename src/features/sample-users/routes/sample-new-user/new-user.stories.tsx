import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import NewUserPage from "./new-user";

const meta = {
  title: "features/users/routes/new-user/NewUser",
  component: NewUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 新規ユーザー作成ページの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
};

/**
 * エラー状態
 * API エラーが発生した際の表示
 */
export const WithError: Story = {
  name: "エラー",
  parameters: {
    msw: {
      handlers: [
        http.post("/api/v1/users", async () => {
          await delay(500);

          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームに入力
    await userEvent.type(canvas.getByLabelText(/名前/i), "山田太郎");
    await userEvent.type(
      canvas.getByLabelText(/メールアドレス/i),
      "yamada@example.com",
    );

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole("button", { name: /作成/i });
    await userEvent.click(submitButton);

    // エラーメッセージが表示されることを確認
    const errorMessage =
      await canvas.findByText(/ユーザーの作成に失敗しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

