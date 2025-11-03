/**
 * プロジェクトAPI レスポンススキーマ
 *
 * APIから返されるレスポンスデータのランタイムバリデーション用スキーマ
 *
 * @module features/projects/types/api
 */

import { z } from "zod";

import { projectMemberSchema, projectSchema, systemRoleSchema, userSchema } from "./index";

/**
 * システムレベルのロールスキーマ
 * types/index.ts のスキーマを再エクスポート
 */
export const SystemRoleSchema = systemRoleSchema;

/**
 * プロジェクトメンバー一覧レスポンススキーマ
 *
 * GET /projects/:projectId/members のレスポンス
 * PATCH /projects/:projectId/members/bulk のレスポンス
 */
export const projectMembersOutputSchema = z.object({
  data: z.array(projectMemberSchema),
});

/**
 * プロジェクトメンバー詳細レスポンススキーマ
 *
 * POST /projects/:projectId/members のレスポンス
 * PATCH /projects/:projectId/members/:memberId のレスポンス
 */
export const projectMemberOutputSchema = z.object({
  data: projectMemberSchema,
});

/**
 * 型推論
 */
export type User = z.infer<typeof userSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type ProjectMembersOutput = z.infer<typeof projectMembersOutputSchema>;
export type ProjectMemberOutput = z.infer<typeof projectMemberOutputSchema>;
