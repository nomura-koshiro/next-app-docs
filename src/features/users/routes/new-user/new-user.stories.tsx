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
 * デフォルトの新規ユーザー作成ページ
 *
 * 注: この Story は実際の API 呼び出しを行うため、
 * MSW (Mock Service Worker) を使用してモックデータを返す必要があります。
 */
export const Default: Story = {};

/**
 * フォーム入力のインタラクションテスト
 *
 * ユーザーがフォームに入力する操作をシミュレート
 */
export const FormInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームフィールドの存在確認
    const nameInput = canvas.getByLabelText(/名前/i);
    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    const roleSelect = canvas.getByLabelText(/ロール/i);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();

    // フォームに入力
    await userEvent.type(nameInput, "山田太郎");
    await userEvent.type(emailInput, "yamada@example.com");

    // 入力値の確認
    expect(nameInput).toHaveValue("山田太郎");
    expect(emailInput).toHaveValue("yamada@example.com");
  },
};

/**
 * バリデーションエラーのテスト
 *
 * 必須フィールドが空の状態で送信ボタンをクリック
 */
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 送信ボタンをクリック（空のフォーム）
    const submitButton = canvas.getByRole("button", { name: /作成/i });
    await userEvent.click(submitButton);

    // バリデーションエラーメッセージが表示されることを確認
    // react-hook-formのエラーメッセージが表示されるまで待機
    const errorMessages = await canvas.findAllByText(/必須/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  },
};

/**
 * フォーム送信成功のテスト
 *
 * 正しい値を入力してフォームを送信
 */
export const SuccessfulSubmit: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("/api/v1/users", async () => {
          await delay(500);

          return HttpResponse.json(
            {
              data: {
                id: "new-user-id",
                name: "山田太郎",
                email: "yamada@example.com",
                role: "user",
              },
            },
            { status: 201 },
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

    // ローディング状態を確認
    expect(canvas.getByRole("button", { name: /作成中/i })).toBeInTheDocument();
  },
};

/**
 * フォーム送信エラーのテスト
 *
 * API エラーが発生した際の表示
 */
export const SubmitError: Story = {
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

/**
 * キャンセルボタンのテスト
 *
 * キャンセルボタンをクリックする操作
 */
export const CancelButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // キャンセルボタンの存在確認
    const cancelButton = canvas.getByRole("button", { name: /キャンセル/i });
    expect(cancelButton).toBeInTheDocument();

    // キャンセルボタンをクリック
    await userEvent.click(cancelButton);

    // Note: router.push('/users')の実際の動作はStorybookでは確認できないため、
    // ボタンがクリック可能であることのみ確認
  },
};

/**
 * ロール選択のテスト
 *
 * セレクトボックスからロールを選択
 */
export const RoleSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ロールセレクトをクリック
    const roleSelect = canvas.getByLabelText(/ロール/i);
    await userEvent.click(roleSelect);

    // オプションが表示されることを確認
    const adminOption = await canvas.findByText("Admin");
    expect(adminOption).toBeInTheDocument();

    // Adminを選択
    await userEvent.click(adminOption);
  },
};

/**
 * メールアドレスの形式バリデーション
 *
 * 無効なメールアドレス形式を入力した場合のエラー表示
 */
export const InvalidEmailFormat: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 有効な名前を入力
    await userEvent.type(canvas.getByLabelText(/名前/i), "山田太郎");

    // 無効なメールアドレスを入力
    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    await userEvent.type(emailInput, "invalid-email");

    // フォーカスを外してバリデーションをトリガー
    await userEvent.tab();

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole("button", { name: /作成/i });
    await userEvent.click(submitButton);

    // メールアドレス形式のエラーメッセージを確認
    const errorMessage = await canvas.findByText(/有効なメールアドレス/i);
    expect(errorMessage).toBeInTheDocument();
  },
};
