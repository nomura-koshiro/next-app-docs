import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import { logger } from "@/utils/logger";

import { createProjectOutputSchema } from "../types/api";
import type { CreateProjectInput } from "../types/forms";
import { getProjectsQueryOptions } from "./get-projects";

// ================================================================================
// API関数
// ================================================================================

/**
 * プロジェクト作成
 *
 * @param data - プロジェクト作成入力データ
 * @returns 作成されたプロジェクト（ランタイムバリデーション済み）
 * @throws {z.ZodError} レスポンスが期待する形式でない場合
 *
 * @example
 * ```tsx
 * const project = await createProject({
 *   name: "新規プロジェクト",
 *   description: "プロジェクトの説明",
 *   is_active: true
 * })
 * console.log(project.data) // Project
 * ```
 */
export const createProject = async (data: CreateProjectInput) => {
  const response = await api.post("/api/v1/projects", data);

  return createProjectOutputSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof createProject>;
};

/**
 * プロジェクト作成フック
 *
 * @example
 * ```tsx
 * const { mutate } = useCreateProject({
 *   mutationConfig: {
 *     onSuccess: () => {
 *       console.log("プロジェクトが作成されました")
 *     }
 *   }
 * })
 *
 * mutate({
 *   name: "新規プロジェクト",
 *   description: "説明",
 *   is_active: true
 * })
 * ```
 */
export const useCreateProject = ({ mutationConfig }: UseCreateProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createProject,
    onSuccess: (...args) => {
      queryClient
        .invalidateQueries({
          queryKey: getProjectsQueryOptions().queryKey,
        })
        .catch((error) => {
          logger.error("プロジェクト一覧クエリの無効化に失敗しました", error);
        });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
