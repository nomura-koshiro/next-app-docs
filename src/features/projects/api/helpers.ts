import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { logger } from "@/utils/logger";

// ================================================================================
// 型定義
// ================================================================================

type UseProjectMemberMutationOptions<TData, TVariables> = {
  /** ミューテーション関数 */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** プロジェクトID */
  projectId: string;
  /** ミューテーション設定 */
  mutationConfig?: Omit<UseMutationOptions<TData, Error, TVariables, unknown>, "mutationFn">;
};

// ================================================================================
// ヘルパー関数
// ================================================================================

/**
 * プロジェクトメンバー関連のミューテーション用共通ヘルパー
 *
 * クエリ無効化処理とエラーハンドリングを自動化し、DRY原則を遵守。
 *
 * @param mutationFn ミューテーション関数
 * @param projectId プロジェクトID
 * @param mutationConfig ミューテーション設定
 * @returns useMutationの結果
 *
 * @example
 * ```tsx
 * export const useAddProjectMember = ({ projectId, mutationConfig }: UseAddProjectMemberOptions) => {
 *   return useProjectMemberMutation({
 *     mutationFn: (data: AddProjectMemberDTO) => addProjectMember({ projectId, data }),
 *     projectId,
 *     mutationConfig,
 *   });
 * };
 * ```
 */
export const useProjectMemberMutation = <TData, TVariables>({
  mutationFn,
  projectId,
  mutationConfig,
}: UseProjectMemberMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn,
    onSuccess: (data, ...args) => {
      // 共通処理: プロジェクトメンバークエリの自動無効化
      queryClient
        .invalidateQueries({
          queryKey: ["projects", projectId, "members"],
        })
        .catch((error) => {
          logger.error("プロジェクトメンバークエリの無効化に失敗しました", error, {
            projectId,
          });
        });

      // カスタムonSuccessがあれば実行
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      // 共通エラーロギング
      logger.error("プロジェクトメンバーミューテーションエラー", error, {
        projectId,
      });

      // カスタムonErrorがあれば実行
      onError?.(error, ...args);
    },
    ...restConfig,
  });
};
