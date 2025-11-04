"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import {
  ControlledCheckboxField,
  ControlledInputField,
  ControlledTextareaField,
} from "@/components/sample-ui/form-field/controlled-form-field";

import { type CreateProjectInput, createProjectSchema } from "../../../types/forms";

type CreateProjectDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 作成処理ハンドラー */
  onCreate: (data: CreateProjectInput) => Promise<void>;
  /** 作成中かどうか */
  isCreating?: boolean;
};

/**
 * プロジェクト新規作成ダイアログコンポーネント
 *
 * プロジェクトを新規作成するためのダイアログ。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - CreateProjectDialogコンポーネントのプロパティ
 * @returns プロジェクト作成ダイアログ要素
 *
 * @example
 * ```tsx
 * <CreateProjectDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   onCreate={handleCreate}
 *   isCreating={isCreating}
 * />
 * ```
 */
export const CreateProjectDialog = ({ isOpen, onClose, onCreate, isCreating = false }: CreateProjectDialogProps) => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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
  const onSubmit = handleSubmit((data: CreateProjectInput) => {
    onCreate(data)
      .then(() => {
        reset();
        onClose();
      })
      .catch(() => {
        // エラーハンドリングは親コンポーネントで行う
      });
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新規プロジェクト作成</DialogTitle>
          <DialogDescription>新しいプロジェクトを作成します</DialogDescription>
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "作成中..." : "作成"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
