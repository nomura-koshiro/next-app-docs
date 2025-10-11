import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import EditUserPage from "./edit-user";

const meta = {
  title: "features/users/routes/edit-user/EditUser",
  component: EditUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのユーザー編集ページ
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
              name: "山田太郎",
              email: "yamada@example.com",
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
 * フォームデータの読み込みと表示
 *
 * ユーザーデータが読み込まれ、フォームに表示されている状態
 */
export const WithData: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームにデータが読み込まれるまで待機
    const nameInput = await canvas.findByDisplayValue("John Doe");
    const emailInput = await canvas.findByDisplayValue("john@example.com");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  },
};

/**
 * フォーム編集のインタラクションテスト
 *
 * ユーザーがフォームを編集する操作をシミュレート
 */
export const EditFormInteraction: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームが読み込まれるまで待機
    const nameInput = await canvas.findByDisplayValue("John Doe");

    // 既存の値をクリアして新しい値を入力
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "佐藤花子");

    // 入力値の確認
    expect(nameInput).toHaveValue("佐藤花子");

    const emailInput = canvas.getByDisplayValue("john@example.com");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "sato@example.com");

    expect(emailInput).toHaveValue("sato@example.com");
  },
};

/**
 * フォーム更新成功のテスト
 *
 * 正しい値を入力してフォームを更新
 */
export const SuccessfulUpdate: Story = {
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
        http.patch("/api/v1/users/:id", async () => {
          await delay(500);

          return HttpResponse.json({
            data: {
              id: "1",
              name: "佐藤花子",
              email: "sato@example.com",
              role: "admin",
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームが読み込まれるまで待機
    const nameInput = await canvas.findByDisplayValue("John Doe");

    // フォームを編集
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "佐藤花子");

    // 更新ボタンをクリック
    const updateButton = canvas.getByRole("button", { name: /更新/i });
    await userEvent.click(updateButton);

    // ローディング状態を確認
    expect(canvas.getByRole("button", { name: /更新中/i })).toBeInTheDocument();
  },
};

/**
 * フォーム更新エラーのテスト
 *
 * API エラーが発生した際の表示
 */
export const UpdateError: Story = {
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
        http.patch("/api/v1/users/:id", async () => {
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

    // フォームが読み込まれるまで待機
    const nameInput = await canvas.findByDisplayValue("John Doe");

    // フォームを編集
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "佐藤花子");

    // 更新ボタンをクリック
    const updateButton = canvas.getByRole("button", { name: /更新/i });
    await userEvent.click(updateButton);

    // エラーメッセージが表示されることを確認
    const errorMessage =
      await canvas.findByText(/ユーザーの更新に失敗しました/i);
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

    // フォームが読み込まれるまで待機
    await canvas.findByDisplayValue("John Doe");

    // キャンセルボタンの存在確認
    const cancelButton = canvas.getByRole("button", { name: /キャンセル/i });
    expect(cancelButton).toBeInTheDocument();

    // キャンセルボタンをクリック
    await userEvent.click(cancelButton);
  },
};

/**
 * ロール変更のテスト
 *
 * セレクトボックスからロールを変更
 */
export const RoleChange: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームが読み込まれるまで待機
    await canvas.findByDisplayValue("John Doe");

    // ロールセレクトをクリック
    const roleSelect = canvas.getByLabelText(/ロール/i);
    await userEvent.click(roleSelect);

    // Adminオプションを選択
    const adminOption = await canvas.findByText("Admin");
    await userEvent.click(adminOption);
  },
};

/**
 * バリデーションエラーのテスト
 *
 * 必須フィールドを空にして更新ボタンをクリック
 */
export const ValidationError: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームが読み込まれるまで待機
    const nameInput = await canvas.findByDisplayValue("John Doe");

    // 名前フィールドをクリア
    await userEvent.clear(nameInput);

    // 更新ボタンをクリック
    const updateButton = canvas.getByRole("button", { name: /更新/i });
    await userEvent.click(updateButton);

    // バリデーションエラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/必須/i);
    expect(errorMessage).toBeInTheDocument();
  },
};
