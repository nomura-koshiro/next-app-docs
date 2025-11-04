"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";

import type { CreateProjectInput } from "../../../types/forms";

// ================================================================================
// Props
// ================================================================================

type ProjectFormProps = {
  register: UseFormRegister<CreateProjectInput>;
  onSubmit: () => void;
  onCancel: () => void;
  errors: FieldErrors<CreateProjectInput>;
  isSubmitting: boolean;
};

// ================================================================================
// Component
// ================================================================================

/**
 * プロジェクト作成フォームコンポーネント
 *
 * プロジェクトの新規作成に必要な入力フィールドを提供します。
 * React Hook Formと連携して、バリデーション付きのフォームを実現します。
 *
 * 機能:
 * - プロジェクト名入力（必須）
 * - 説明入力（任意、最大500文字）
 * - ステータス選択（アクティブ/非アクティブ）
 * - バリデーションエラー表示
 * - 送信中の状態管理
 *
 * @param props - コンポーネントのプロパティ
 * @param props.register - React Hook Formのregister関数
 * @param props.onSubmit - フォーム送信ハンドラー
 * @param props.onCancel - キャンセルハンドラー
 * @param props.errors - フォームバリデーションエラー
 * @param props.isSubmitting - 送信中フラグ
 * @returns プロジェクト作成フォームコンポーネント
 *
 * @example
 * ```tsx
 * <ProjectForm
 *   register={register}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   errors={errors}
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */
export const ProjectForm = ({ register, onSubmit, onCancel, errors, isSubmitting }: ProjectFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ============================================================ */}
      {/* プロジェクト名 */}
      {/* ============================================================ */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          プロジェクト名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="プロジェクト名を入力"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* ============================================================ */}
      {/* 説明 */}
      {/* ============================================================ */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="プロジェクトの説明を入力（任意）"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* ============================================================ */}
      {/* ステータス */}
      {/* ============================================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700">ステータス</label>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              {...register("is_active")}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">アクティブ</span>
          </label>
        </div>
        {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active.message}</p>}
      </div>

      {/* ============================================================ */}
      {/* エラーメッセージ */}
      {/* ============================================================ */}
      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errors.root.message}</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* ボタン */}
      {/* ============================================================ */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "作成中..." : "作成"}
        </Button>
      </div>
    </form>
  );
};
