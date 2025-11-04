/**
 * プロジェクトAPI用のMSWハンドラー
 */

import { http, HttpResponse } from "msw";

import type { Project } from "@/features/projects/types";
import type { CreateProjectInput } from "@/features/projects/types/forms";

import { mockProjects } from "./project-member-handlers";

// ================================================================================
// ハンドラー
// ================================================================================

export const projectHandlers = [
  /**
   * GET /api/v1/projects
   * プロジェクト一覧取得
   */
  http.get("*/api/v1/projects", () => {
    return HttpResponse.json({
      data: mockProjects,
    });
  }),

  /**
   * POST /api/v1/projects
   * プロジェクト作成
   */
  http.post("*/api/v1/projects", async ({ request }) => {
    const body = (await request.json()) as CreateProjectInput;

    const newProject: Project = {
      id: `project-${mockProjects.length + 1}`,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "user-1", // モックでは固定値
    };

    mockProjects.push(newProject);

    return HttpResponse.json(
      {
        data: newProject,
      },
      { status: 201 }
    );
  }),

  /**
   * GET /api/v1/projects/:projectId
   * プロジェクト詳細取得
   */
  http.get("*/api/v1/projects/:projectId", ({ params }) => {
    const { projectId } = params;

    const project = mockProjects.find((p) => p.id === projectId);

    if (!project) {
      return HttpResponse.json(
        {
          type: "https://api.example.com/problems/resource-not-found",
          title: "Resource Not Found",
          status: 404,
          detail: "The specified project does not exist",
          instance: `/api/v1/projects/${projectId}`,
        },
        {
          status: 404,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    }

    return HttpResponse.json({
      data: project,
    });
  }),
];
