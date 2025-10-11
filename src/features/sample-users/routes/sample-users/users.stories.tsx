import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { http, HttpResponse, delay } from "msw";
import UsersPage from "./users";

const meta = {
  title: "features/users/routes/users/Users",
  component: UsersPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UsersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ユーザー一覧ページの通常状態
 */
export const UsersList: Story = {
  name: "ユーザー一覧表示",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const userName = await canvas.findByText("John Doe");
    expect(userName).toBeInTheDocument();

    const userEmail = await canvas.findByText("john@example.com");
    expect(userEmail).toBeInTheDocument();

    expect(canvas.getByText("ID")).toBeInTheDocument();
    expect(canvas.getByText("名前")).toBeInTheDocument();
    expect(canvas.getByText("メールアドレス")).toBeInTheDocument();
    expect(canvas.getByText("ロール")).toBeInTheDocument();
  },
};

/**
 * ローディング状態
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", async () => {
          await delay(5000);

          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                role: "user",
                createdAt: "2024-01-01",
              },
            ],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loadingElement = canvas.getByTestId("loading-spinner");
    expect(loadingElement).toBeInTheDocument();
  },
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
        http.get("/api/v1/users", () => {
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

    const errorMessage = await canvas.findByText(/エラーが発生しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * 空の状態
 * ユーザーが存在しない場合の表示
 */
export const EmptyState: Story = {
  name: "空の状態",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyMessage = await canvas.findByText(/ユーザーが見つかりません/i);
    expect(emptyMessage).toBeInTheDocument();
  },
};

/**
 * 多数のユーザー
 * 多数のユーザーが存在する場合の表示
 */
export const ManyUsers: Story = {
  name: "多数のユーザー",
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          const users = Array.from({ length: 20 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 3 === 0 ? "admin" : "user",
            createdAt: "2024-01-01",
          }));

          return HttpResponse.json({ data: users });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("User 1");

    const userNames = canvas.getAllByText(/User \d+/);
    expect(userNames.length).toBeGreaterThan(10);
  },
};

