/**
 * プロジェクトAPI レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ。
 * Zodを使用してAPIレスポンスの型安全性を実現します。
 *
 * @module features/projects/types/api
 */

import { z } from "zod";

import { projectMemberSchema, projectSchema } from ".";

// ================================================================================
// API レスポンススキーマ
// ================================================================================

/**
 * プロジェクト一覧レスポンススキーマ
 *
 * GET /api/v1/projects のレスポンス
 */
export const projectsOutputSchema = z.object({
  data: z.array(projectSchema),
});

/**
 * プロジェクト一覧レスポンス型
 */
export type ProjectsOutput = z.infer<typeof projectsOutputSchema>;

/**
 * プロジェクト詳細レスポンススキーマ
 *
 * GET /api/v1/projects/:id のレスポンス
 */
export const projectOutputSchema = z.object({
  data: projectSchema,
});

/**
 * プロジェクト詳細レスポンス型
 */
export type ProjectOutput = z.infer<typeof projectOutputSchema>;

/**
 * プロジェクト作成レスポンススキーマ
 *
 * POST /api/v1/projects のレスポンス
 */
export const createProjectOutputSchema = z.object({
  data: projectSchema,
});

/**
 * プロジェクト作成レスポンス型
 */
export type CreateProjectOutput = z.infer<typeof createProjectOutputSchema>;

/**
 * プロジェクトメンバー一覧レスポンススキーマ
 *
 * GET /api/v1/projects/:projectId/members のレスポンス
 */
export const projectMembersOutputSchema = z.object({
  data: z.array(projectMemberSchema),
});

/**
 * プロジェクトメンバー一覧レスポンス型
 */
export type ProjectMembersOutput = z.infer<typeof projectMembersOutputSchema>;

/**
 * プロジェクトメンバー詳細レスポンススキーマ
 *
 * GET /api/v1/projects/:projectId/members/:memberId のレスポンス
 */
export const projectMemberOutputSchema = z.object({
  data: projectMemberSchema,
});

/**
 * プロジェクトメンバー詳細レスポンス型
 */
export type ProjectMemberOutput = z.infer<typeof projectMemberOutputSchema>;

/**
 * エラーレスポンス型
 *
 * RFC 9457 (Problem Details) 形式のエラーレスポンス
 */
export type ErrorOutput = {
  message: string;
  detail?: string;
};
