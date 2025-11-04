"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useCreateProject } from "../../api";
import { type CreateProjectInput, createProjectSchema } from "../../types";

/**
 * 新規プロジェクト作成ページのロジックを管理するカスタムフック
 *
 * React Hook FormとZodを使用したフォームバリデーション、
 * プロジェクト作成API呼び出し、成功時のナビゲーションを管理します。
 *
 * @returns フォームの状態と操作関数
 * @returns register - React Hook Formのregister関数
 * @returns onSubmit - フォーム送信ハンドラー
 * @returns handleCancel - キャンセルハンドラー（一覧へ戻る）
 * @returns errors - フォームバリデーションエラー
 * @returns isSubmitting - 送信中フラグ
 *
 * @example
 * ```tsx
 * const { register, onSubmit, handleCancel, errors, isSubmitting } = useNewProject()
 *
 * <form onSubmit={onSubmit}>
 *   <input {...register('name')} />
 *   {errors.name && <span>{errors.name.message}</span>}
 *   <button type="submit" disabled={isSubmitting}>作成</button>
 *   <button type="button" onClick={handleCancel}>キャンセル</button>
 * </form>
 * ```
 */
export const useNewProject = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const createProjectMutation = useCreateProject();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * フォーム送信ハンドラー
   *
   * 処理フロー:
   * 1. APIにプロジェクト作成リクエスト送信
   * 2. 成功時: プロジェクト一覧ページへ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (data: CreateProjectInput) => {
    await createProjectMutation
      .mutateAsync(data)
      .then(() => {
        router.push("/projects");
      })
      .catch(() => {
        setError("root", {
          message: "プロジェクトの作成に失敗しました",
        });
      });
  });

  /**
   * キャンセルハンドラー
   *
   * プロジェクト一覧ページへ遷移します。
   */
  const handleCancel = useCallback(() => {
    router.push("/projects");
  }, [router]);

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    register,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting: createProjectMutation.isPending,
  };
};
