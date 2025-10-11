import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import DeleteUserPage from "./delete-user";

const meta = {
  title: "features/sample-users/routes/sample-delete-user/DeleteUser",
  component: DeleteUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeleteUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ユーザー削除確認ページの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    params: Promise.resolve({ id: "1" }),
  },
};

/**
 * ローディング状態
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/sample/users/:id", async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ローディングスピナーが表示されることを確認
    const loadingElement = canvas.getByTestId("loading-spinner");
    expect(loadingElement).toBeInTheDocument();
  },
};

/**
 * エラー状態
 * ユーザーデータの読み込みに失敗した状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    params: Promise.resolve({ id: "999" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/sample/users/:id", () => {
          return HttpResponse.json(
            { message: "User not found" },
            { status: 404 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // エラーメッセージが表示されることを確認
    const errorMessage =
      await canvas.findByText(/ユーザーの読み込みに失敗しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

