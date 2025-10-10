/**
 * ユーザーAPI用のMSWハンドラー
 */

import { http, HttpResponse } from "msw";
import type { User } from "@/features/users/types";

// モックデータ
let mockUsers: User[] = [
  {
    id: "1",
    name: "山田太郎",
    email: "yamada@example.com",
    role: "admin",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    role: "user",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "user",
    createdAt: "2024-03-10",
  },
];

export const userHandlers = [
  /**
   * GET /api/v1/users
   * ユーザー一覧取得
   */
  http.get("/api/v1/users", () => {
    return HttpResponse.json({
      data: mockUsers,
    });
  }),

  /**
   * GET /api/v1/users/:id
   * ユーザー詳細取得
   */
  http.get("/api/v1/users/:id", ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (user === undefined) {
      return HttpResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      data: user,
    });
  }),

  /**
   * POST /api/v1/users
   * ユーザー作成
   */
  http.post("/api/v1/users", async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      role: string;
    };

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: body.name,
      email: body.email,
      role: body.role,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /**
   * PUT /api/v1/users/:id
   * ユーザー更新
   */
  http.put("/api/v1/users/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as {
      name: string;
      email: string;
      role: string;
    };

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: body.name,
      email: body.email,
      role: body.role,
    };

    return HttpResponse.json(mockUsers[userIndex]);
  }),

  /**
   * DELETE /api/v1/users/:id
   * ユーザー削除
   */
  http.delete("/api/v1/users/:id", ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    mockUsers = mockUsers.filter((u) => u.id !== id);

    return HttpResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 },
    );
  }),
];
