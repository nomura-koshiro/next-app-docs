/**
 * プロジェクトメンバー入力値バリデーションスキーマ
 *
 * ユーザー入力（prompt等）から取得した値のランタイムバリデーション用スキーマ
 */

import { z } from "zod";

/**
 * プロジェクトロール入力スキーマ
 *
 * ユーザーから入力されたロール文字列を検証
 */
export const ProjectRoleInputSchema = z.enum([
  "project_manager",
  "project_moderator",
  "member",
  "viewer",
]);

/**
 * 型推論
 */
export type ProjectRoleInput = z.infer<typeof ProjectRoleInputSchema>;
