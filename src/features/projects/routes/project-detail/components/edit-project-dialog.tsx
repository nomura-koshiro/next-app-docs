"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import {
  ControlledCheckboxField,
  ControlledInputField,
  ControlledTextareaField,
} from "@/components/sample-ui/form-field/controlled-form-field";

import type { Project } from "../../../types";
import { type UpdateProjectInput, updateProjectSchema } from "../../../types/forms";

type EditProjectDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 編集対象のプロジェクト */
  project: Project;
  /** 更新処理ハンドラー */
  onUpdate: (data: UpdateProjectInput) => Promise<void>;
  /** 更新中かどうか */
  isUpdating?: boolean;
};

/**
 * プロジェクト編集ダイアログコンポーネント
 *
 * プロジェクト情報を編集するためのダイアログ。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - EditProjectDialogコンポーネントのプロパティ
 * @returns プロジェクト編集ダイアログ要素
 *
 * @example
 * ```tsx
 * <EditProjectDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   project={project}
 *   onUpdate={handleUpdate}
 *   isUpdating={isUpdating}
 * />
 * ```
 */
export const EditProjectDialog = ({ isOpen, onClose, project, onUpdate, isUpdating = false }: EditProjectDialogProps) => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      is_active: project.is_active,
    },
  });

  // ================================================================================
  // Effects
  // ================================================================================
  // プロジェクトが変更されたらフォームをリセット
  useEffect(() => {
    reset({
      name: project.name,
      description: project.description ?? "",
      is_active: project.is_active,
    });
  }, [project, reset]);

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((data: UpdateProjectInput) => {
    onUpdate(data)
      .then(() => {
        onClose();
      })
      .catch(() => {
        // エラーハンドリングは親コンポーネントで行う
      });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>プロジェクト情報を編集</DialogTitle>
          <DialogDescription>プロジェクトの情報を編集してください</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <ControlledInputField control={control} name="name" label="プロジェクト名" placeholder="プロジェクト名を入力" required />

          <ControlledTextareaField
            control={control}
            name="description"
            label="説明"
            placeholder="プロジェクトの説明を入力（任意）"
            rows={4}
          />

          <ControlledCheckboxField control={control} name="is_active" label="アクティブ" />

          {errors.root && <ErrorMessage message={errors.root.message ?? ""} />}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "更新中..." : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
