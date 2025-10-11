import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import DeleteUserPage from "./delete-user";

const meta = {
  title: "features/users/routes/delete-user/DeleteUser",
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
 * デフォルトの削除確認ページ
 *
 * 注: この Story は実際の API 呼び出しを行うため、
 * MSW (Mock Service Worker) を使用してモックデータを返す必要があります。
 */
export const Default: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
};

/**
 * ローディング状態の表示確認
 *
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users/:id", async () => {
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
 * ユーザー情報の表示確認
 *
 * 削除対象のユーザー情報が表示されている状態
 */
export const WithUserData: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ユーザー情報が表示されるまで待機
    const userName = await canvas.findByText("John Doe");
    const userEmail = await canvas.findByText("john@example.com");

    expect(userName).toBeInTheDocument();
    expect(userEmail).toBeInTheDocument();

    // 警告メッセージの確認
    const warningMessage = canvas.getByText(/本当に削除しますか/i);
    expect(warningMessage).toBeInTheDocument();
  },
};

/**
 * 削除ボタンのインタラクションテスト
 *
 * 削除ボタンをクリックする操作をシミュレート
 */
export const DeleteButtonClick: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users/:id", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
            },
          });
        }),
        http.delete("/api/v1/users/:id", async () => {
          await delay(500);

          return new HttpResponse(null, { status: 204 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ユーザー情報が表示されるまで待機
    await canvas.findByText("John Doe");

    // 削除ボタンをクリック
    const deleteButton = canvas.getByRole("button", { name: /削除/i });
    await userEvent.click(deleteButton);

    // ローディング状態を確認
    expect(canvas.getByRole("button", { name: /削除中/i })).toBeInTheDocument();
  },
};

/**
 * 削除エラーのテスト
 *
 * API エラーが発生した際の表示
 */
export const DeleteError: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users/:id", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
            },
          });
        }),
        http.delete("/api/v1/users/:id", async () => {
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

    // ユーザー情報が表示されるまで待機
    await canvas.findByText("John Doe");

    // 削除ボタンをクリック
    const deleteButton = canvas.getByRole("button", { name: /削除/i });
    await userEvent.click(deleteButton);

    // エラーメッセージが表示されることを確認
    const errorMessage =
      await canvas.findByText(/ユーザーの削除に失敗しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * データ読み込みエラー状態
 *
 * ユーザーデータの読み込みに失敗した状態
 */
export const LoadError: Story = {
  args: {
    params: Promise.resolve({ id: "999" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users/:id", () => {
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

/**
 * キャンセルボタンのテスト
 *
 * キャンセルボタンをクリックする操作
 */
export const CancelButton: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ユーザー情報が表示されるまで待機
    await canvas.findByText("John Doe");

    // キャンセルボタンの存在確認
    const cancelButton = canvas.getByRole("button", { name: /キャンセル/i });
    expect(cancelButton).toBeInTheDocument();

    // キャンセルボタンをクリック
    await userEvent.click(cancelButton);
  },
};

/**
 * 削除確認ダイアログの表示確認
 *
 * 削除の危険性を示すメッセージとボタンスタイルを確認
 */
export const DangerousAction: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ユーザー情報が表示されるまで待機
    await canvas.findByText("John Doe");

    // 警告メッセージの確認
    const warningText = canvas.getByText(/この操作は取り消せません/i);
    expect(warningText).toBeInTheDocument();

    // 削除ボタンがdestructiveスタイルであることを確認
    const deleteButton = canvas.getByRole("button", { name: /削除/i });
    expect(deleteButton).toBeInTheDocument();
  },
};

/**
 * ボタンの無効化状態
 *
 * 削除処理中はボタンが無効化されることを確認
 */
export const DisabledButtons: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users/:id", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
            },
          });
        }),
        http.delete("/api/v1/users/:id", async () => {
          await delay(2000);

          return new HttpResponse(null, { status: 204 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ユーザー情報が表示されるまで待機
    await canvas.findByText("John Doe");

    // 削除ボタンをクリック
    const deleteButton = canvas.getByRole("button", { name: /削除/i });
    await userEvent.click(deleteButton);

    // ボタンが無効化されていることを確認
    const deletingButton = canvas.getByRole("button", { name: /削除中/i });
    expect(deletingButton).toBeDisabled();
  },
};
