"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import { ControlledInputField, ControlledSelectField } from "@/components/sample-ui/form-field/controlled-form-field";

import { PROJECT_MESSAGES } from "../../../constants/messages";
import { type AddProjectMemberInput, addProjectMemberSchema } from "../../../types/forms";

type AddMemberDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 追加処理ハンドラー */
  onAdd: (data: AddProjectMemberInput) => Promise<void>;
  /** 追加中かどうか */
  isAdding: boolean;
};

/**
 * メンバー追加ダイアログコンポーネント
 *
 * プロジェクトに新しいメンバーを追加するためのフォーム。
 * ユーザーIDとロールを入力して追加します。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - AddMemberDialogコンポーネントのプロパティ
 * @returns メンバー追加ダイアログ要素
 *
 * @example
 * ```tsx
 * <AddMemberDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   onAdd={handleAddMember}
 *   isAdding={isAdding}
 * />
 * ```
 */
export const AddMemberDialog = ({ isOpen, onClose, onAdd, isAdding }: AddMemberDialogProps) => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<AddProjectMemberInput>({
    resolver: zodResolver(addProjectMemberSchema),
    defaultValues: {
      user_id: "",
      role: "member",
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((data: AddProjectMemberInput) => {
    onAdd(data)
      .then(() => {
        reset();
        onClose();
      })
      .catch(() => {
        setError("root", {
          message: PROJECT_MESSAGES.ERRORS.MEMBER_ADD_FAILED,
        });
      });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メンバーを追加</DialogTitle>
          <DialogDescription>プロジェクトに新しいメンバーを追加します</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <ControlledInputField control={control} name="user_id" label="ユーザーID" placeholder="ユーザーIDを入力" required />

          <ControlledSelectField
            control={control}
            name="role"
            label="ロール"
            options={[
              { value: "project_manager", label: "プロジェクトマネージャー" },
              { value: "project_moderator", label: "権限管理者" },
              { value: "member", label: "メンバー" },
              { value: "viewer", label: "閲覧者" },
            ]}
            required
          />

          {errors.root && <ErrorMessage message={errors.root.message ?? ""} />}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isAdding}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "追加中..." : "追加"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
