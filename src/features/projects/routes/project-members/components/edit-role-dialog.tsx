"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import { ControlledSelectField } from "@/components/sample-ui/form-field/controlled-form-field";

import type { ProjectMember, ProjectRole } from "../../../types";
import { type UpdateMemberRoleInput, updateMemberRoleSchema } from "../../../types/forms";

type EditRoleDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 編集対象のメンバー */
  member: ProjectMember | null;
  /** ロール更新処理ハンドラー */
  onUpdate: (memberId: string, newRole: ProjectRole) => void;
  /** 更新中かどうか */
  isUpdating?: boolean;
};

/**
 * メンバーロール編集ダイアログコンポーネント
 *
 * プロジェクトメンバーのロールを変更するためのダイアログ。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - EditRoleDialogコンポーネントのプロパティ
 * @returns ロール編集ダイアログ要素
 *
 * @example
 * ```tsx
 * <EditRoleDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   member={selectedMember}
 *   onUpdate={handleUpdateRole}
 *   isUpdating={isUpdating}
 * />
 * ```
 */
export const EditRoleDialog = ({ isOpen, onClose, member, onUpdate, isUpdating = false }: EditRoleDialogProps) => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateMemberRoleInput>({
    resolver: zodResolver(updateMemberRoleSchema),
    defaultValues: {
      role: member?.role || "member",
    },
  });

  // ================================================================================
  // Effects
  // ================================================================================
  // メンバーが変更されたらフォームをリセット
  useEffect(() => {
    if (member) {
      reset({ role: member.role });
    }
  }, [member, reset]);

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit(async (data: UpdateMemberRoleInput) => {
    if (member) {
      onUpdate(member.id, data.role);
      onClose();
    }
  });

  if (!member) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ロールを変更</DialogTitle>
          <DialogDescription>{member.user?.display_name || "Unknown User"} のロールを変更します</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 font-medium">ユーザー名:</span>
                <span>{member.user?.display_name || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">メールアドレス:</span>
                <span>{member.user?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          <ControlledSelectField
            control={control}
            name="role"
            label="新しいロール"
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
