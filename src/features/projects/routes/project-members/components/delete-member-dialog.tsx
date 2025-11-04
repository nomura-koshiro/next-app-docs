"use client";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";

import type { ProjectMember } from "../../../types";

type DeleteMemberDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 削除対象のメンバー */
  member: ProjectMember | null;
  /** 削除処理ハンドラー */
  onDelete: (memberId: string) => void;
  /** 削除中かどうか */
  isDeleting?: boolean;
};

/**
 * メンバー削除確認ダイアログコンポーネント
 *
 * プロジェクトメンバーを削除する前に、ユーザーに確認を求めるダイアログです。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - DeleteMemberDialogコンポーネントのプロパティ
 * @returns 削除確認ダイアログ要素
 *
 * @example
 * ```tsx
 * <DeleteMemberDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   member={selectedMember}
 *   onDelete={handleDeleteMember}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export const DeleteMemberDialog = ({ isOpen, onClose, member, onDelete, isDeleting = false }: DeleteMemberDialogProps) => {
  const handleDelete = () => {
    if (member) {
      onDelete(member.id);
      onClose();
    }
  };

  if (!member) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メンバーを削除</DialogTitle>
          <DialogDescription>このメンバーをプロジェクトから削除しますか？</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-red-600">この操作は取り消せません。</p>

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
              <div className="flex">
                <span className="w-32 font-medium">ロール:</span>
                <span>{member.role}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
