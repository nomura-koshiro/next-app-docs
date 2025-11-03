/**
 * サンプルユーザーAPI用のMSWハンドラー
 */

import { http, HttpResponse } from "msw";

import type { CreateUserInput, SampleUser as User, UpdateUserInput, UserRole } from "@/types/models/user";
import { notFoundResponse } from "@/mocks/utils/problem-details";

// モックデータ
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: "2024-03-10",
  },
];

export const userHandlers = [
  /**
   * GET /api/v1/sample/users
   * サンプルユーザー一覧取得
   */
  http.get("*/api/v1/sample/users", () => {
    return HttpResponse.json({
      data: mockUsers,
    });
  }),

  /**
   * GET /api/v1/sample/users/:id
   * ユーザー詳細取得
   */
  http.get("*/api/v1/sample/users/:id", ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (user === undefined) {
      return notFoundResponse("User", id as string, `/api/v1/sample/users/${id}`);
    }

    return HttpResponse.json({
      data: user,
    });
  }),

  /**
   * POST /api/v1/sample/users
   * ユーザー作成
   */
  http.post("*/api/v1/sample/users", async ({ request }) => {
    const body = (await request.json()) as CreateUserInput;

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: body.name,
      email: body.email,
      role: body.role as UserRole,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /**
   * PUT /api/v1/sample/users/:id
   * ユーザー更新
   */
  http.put("*/api/v1/sample/users/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as CreateUserInput;

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return notFoundResponse("User", id as string, `/api/v1/sample/users/${id}`);
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: body.name,
      email: body.email,
      role: body.role as UserRole,
    };

    return HttpResponse.json({ data: mockUsers[userIndex] });
  }),

  /**
   * PATCH /api/v1/sample/users/:id
   * ユーザー部分更新
   */
  http.patch("*/api/v1/sample/users/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as UpdateUserInput;

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return notFoundResponse("User", id as string, `/api/v1/sample/users/${id}`);
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
    };

    return HttpResponse.json({ data: mockUsers[userIndex] });
  }),

  /**
   * DELETE /api/v1/sample/users/:id
   * ユーザー削除
   */
  http.delete("*/api/v1/sample/users/:id", ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return notFoundResponse("User", id as string, `/api/v1/sample/users/${id}`);
    }

    mockUsers.splice(userIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
