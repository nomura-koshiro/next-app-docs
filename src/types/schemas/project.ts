/**
 * プロジェクト型のZodスキーマ定義
 *
 * @module types/schemas/project
 */

import { z } from "zod";

// ================================================================================
// プロジェクトスキーマ
// ================================================================================

/**
 * プロジェクトのスキーマ
 */
export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid(),
});

export type Project = z.infer<typeof projectSchema>;
