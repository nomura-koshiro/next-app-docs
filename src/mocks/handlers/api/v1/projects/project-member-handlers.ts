/**
 * プロジェクトメンバーAPI用のMSWハンドラー
 */

import { http, HttpResponse } from "msw";

import type {
  AddProjectMemberDTO,
  BulkUpdateRolesDTO,
  Project,
  ProjectMember,
  ProjectRole,
  UpdateMemberRoleDTO,
  User,
} from "@/features/projects/types";
import { SystemRole } from "@/features/projects/types";

// ================================================================================
// モックデータ
// ================================================================================

// モックユーザー
const mockUsers: User[] = [
  {
    id: "user-1",
    azure_oid: "azure-oid-1",
    email: "manager@example.com",
    display_name: "田中 太郎",
    roles: [SystemRole.USER],
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    last_login: "2024-10-01T10:00:00Z",
  },
  {
    id: "user-2",
    azure_oid: "azure-oid-2",
    email: "moderator@example.com",
    display_name: "鈴木 花子",
    roles: [SystemRole.USER],
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    last_login: "2024-10-02T11:00:00Z",
  },
  {
    id: "user-3",
    azure_oid: "azure-oid-3",
    email: "member@example.com",
    display_name: "佐藤 次郎",
    roles: [SystemRole.USER],
    is_active: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    last_login: "2024-10-03T12:00:00Z",
  },
  {
    id: "user-4",
    azure_oid: "azure-oid-4",
    email: "viewer@example.com",
    display_name: "高橋 三郎",
    roles: [SystemRole.USER],
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
    last_login: "2024-10-04T13:00:00Z",
  },
  {
    id: "user-5",
    azure_oid: "azure-oid-5",
    email: "admin@example.com",
    display_name: "山田 管理者",
    roles: [SystemRole.SYSTEM_ADMIN],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    last_login: "2024-10-05T14:00:00Z",
  },
];

// モックプロジェクト
const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "サンプルプロジェクト",
    description: "これはサンプルプロジェクトです",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: "user-1",
  },
];

// モックプロジェクトメンバー
const mockProjectMembers: ProjectMember[] = [
  {
    id: "member-1",
    project_id: "project-1",
    user_id: "user-1",
    role: "project_manager" as ProjectRole,
    joined_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: mockUsers[0],
    project: mockProjects[0],
  },
  {
    id: "member-2",
    project_id: "project-1",
    user_id: "user-2",
    role: "project_moderator" as ProjectRole,
    joined_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    user: mockUsers[1],
    project: mockProjects[0],
  },
  {
    id: "member-3",
    project_id: "project-1",
    user_id: "user-3",
    role: "member" as ProjectRole,
    joined_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    user: mockUsers[2],
    project: mockProjects[0],
  },
  {
    id: "member-4",
    project_id: "project-1",
    user_id: "user-4",
    role: "viewer" as ProjectRole,
    joined_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
    user: mockUsers[3],
    project: mockProjects[0],
  },
];

// ================================================================================
// ハンドラー
// ================================================================================

export const projectMemberHandlers = [
  /**
   * GET /api/v1/projects/:projectId/members
   * プロジェクトメンバー一覧取得
   */
  http.get("*/api/v1/projects/:projectId/members", ({ params }) => {
    const { projectId } = params;

    const members = mockProjectMembers.filter((m) => m.project_id === projectId);

    return HttpResponse.json({
      data: members,
    });
  }),

  /**
   * POST /api/v1/projects/:projectId/members
   * プロジェクトメンバー追加
   */
  http.post("*/api/v1/projects/:projectId/members", async ({ params, request }) => {
    const { projectId } = params;
    const body = (await request.json()) as AddProjectMemberDTO;

    // ユーザーの存在確認
    const user = mockUsers.find((u) => u.id === body.user_id);
    if (!user) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/resource-not-found",
          title: "Resource Not Found",
          status: 404,
          detail: "The specified user does not exist",
          instance: `/api/v1/projects/${projectId}/members`,
        },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    // 既にメンバーかチェック
    const existingMember = mockProjectMembers.find((m) => m.project_id === projectId && m.user_id === body.user_id);
    if (existingMember) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/duplicate-resource",
          title: "Duplicate Resource",
          status: 409,
          detail: "User is already a member of this project",
          instance: `/api/v1/projects/${projectId}/members`,
        },
        {
          status: 409,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    const newMember: ProjectMember = {
      id: `member-${mockProjectMembers.length + 1}`,
      project_id: projectId as string,
      user_id: body.user_id,
      role: body.role,
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user,
      project: mockProjects.find((p) => p.id === projectId),
    };

    mockProjectMembers.push(newMember);

    return HttpResponse.json(
      {
        data: newMember,
      },
      { status: 201 }
    );
  }),

  /**
   * PATCH /api/v1/projects/:projectId/members/:memberId
   * プロジェクトメンバーのロール更新
   */
  http.patch("*/api/v1/projects/:projectId/members/:memberId", async ({ params, request }) => {
    const { projectId, memberId } = params;
    const body = (await request.json()) as UpdateMemberRoleDTO;

    const memberIndex = mockProjectMembers.findIndex((m) => m.id === memberId && m.project_id === projectId);

    if (memberIndex === -1) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/resource-not-found",
          title: "Resource Not Found",
          status: 404,
          detail: "The specified project member does not exist",
          instance: `/api/v1/projects/${projectId}/members/${memberId}`,
        },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    mockProjectMembers[memberIndex] = {
      ...mockProjectMembers[memberIndex],
      role: body.role,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockProjectMembers[memberIndex],
    });
  }),

  /**
   * DELETE /api/v1/projects/:projectId/members/:memberId
   * プロジェクトメンバー削除
   */
  http.delete("*/api/v1/projects/:projectId/members/:memberId", ({ params }) => {
    const { projectId, memberId } = params;

    const memberIndex = mockProjectMembers.findIndex((m) => m.id === memberId && m.project_id === projectId);

    if (memberIndex === -1) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/resource-not-found",
          title: "Resource Not Found",
          status: 404,
          detail: "The specified project member does not exist",
          instance: `/api/v1/projects/${projectId}/members/${memberId}`,
        },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    mockProjectMembers.splice(memberIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  /**
   * PATCH /api/v1/projects/:projectId/members/bulk
   * プロジェクトメンバーのロール一括更新
   */
  http.patch("*/api/v1/projects/:projectId/members/bulk", async ({ params, request }) => {
    const { projectId } = params;
    const body = (await request.json()) as BulkUpdateRolesDTO;

    const updatedMembers: ProjectMember[] = [];

    for (const update of body.updates) {
      const memberIndex = mockProjectMembers.findIndex((m) => m.id === update.member_id && m.project_id === projectId);

      if (memberIndex !== -1) {
        mockProjectMembers[memberIndex] = {
          ...mockProjectMembers[memberIndex],
          role: update.role,
          updated_at: new Date().toISOString(),
        };
        updatedMembers.push(mockProjectMembers[memberIndex]);
      }
    }

    return HttpResponse.json({
      data: updatedMembers,
    });
  }),
];
