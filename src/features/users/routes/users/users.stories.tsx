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

export const Default: Story = {};

export const WithUsers: Story = {
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

export const Loading: Story = {
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

export const Error: Story = {
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

export const EmptyState: Story = {
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

export const CreateUserButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("John Doe");

    const createButton = canvas.getByRole("button", {
      name: /新規ユーザー作成/i,
    });
    expect(createButton).toBeInTheDocument();

    await userEvent.click(createButton);
  },
};

export const EditButtonClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("John Doe");

    const editButtons = canvas.getAllByRole("button", { name: /編集/i });
    expect(editButtons.length).toBeGreaterThan(0);

    await userEvent.click(editButtons[0]);
  },
};

export const DeleteButtonClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("John Doe");

    const deleteButtons = canvas.getAllByRole("button", { name: /削除/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    await userEvent.click(deleteButtons[0]);
  },
};

export const WithManyUsers: Story = {
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

export const RoleBadges: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/v1/users", () => {
          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "Admin User",
                email: "admin@example.com",
                role: "admin",
                createdAt: "2024-01-01",
              },
              {
                id: "2",
                name: "Regular User",
                email: "user@example.com",
                role: "user",
                createdAt: "2024-01-02",
              },
            ],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("Admin User");

    const adminBadge = canvas.getByText("admin");
    expect(adminBadge).toBeInTheDocument();

    const userBadge = canvas.getByText("user");
    expect(userBadge).toBeInTheDocument();
  },
};

export const RowHoverEffect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const userName = await canvas.findByText("John Doe");

    const row = userName.closest("tr");
    expect(row).toBeInTheDocument();

    expect(row).toHaveClass("hover:bg-gray-50");
  },
};

export const PageHeaderDisplay: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("John Doe");

    const pageTitle = canvas.getByText("ユーザー一覧");
    expect(pageTitle).toBeInTheDocument();

    const createButton = canvas.getByRole("button", {
      name: /新規ユーザー作成/i,
    });
    expect(createButton).toBeInTheDocument();
  },
};

export const TableColumns: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("John Doe");

    expect(canvas.getByText("ID")).toBeInTheDocument();
    expect(canvas.getByText("名前")).toBeInTheDocument();
    expect(canvas.getByText("メールアドレス")).toBeInTheDocument();
    expect(canvas.getByText("ロール")).toBeInTheDocument();
    expect(canvas.getByText("作成日")).toBeInTheDocument();
    expect(canvas.getByText("操作")).toBeInTheDocument();
  },
};
