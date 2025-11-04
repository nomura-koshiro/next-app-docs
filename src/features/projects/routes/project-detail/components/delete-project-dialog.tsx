"use client";

import { Button } from "@/components/sample-ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/sample-ui/dialog";
import { ErrorMessage } from "@/components/sample-ui/error-message";

import { PROJECT_MESSAGES } from "../../../constants/messages";
import type { Project } from "../../../types";

type DeleteProjectDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 削除対象のプロジェクト */
  project: Project;
  /** 削除処理ハンドラー */
  onDelete: () => void;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** 削除エラーメッセージ */
  error?: string | null;
};

/**
 * プロジェクト削除確認ダイアログコンポーネント
 *
 * プロジェクトを削除する前に、ユーザーに確認を求めるダイアログです。
 * アクセシビリティ対応（キーボードナビゲーション、ARIA属性）を実装しています。
 *
 * @param props - DeleteProjectDialogコンポーネントのプロパティ
 * @returns 削除確認ダイアログ要素
 *
 * @example
 * ```tsx
 * <DeleteProjectDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   project={project}
 *   onDelete={handleDelete}
 *   isDeleting={isDeleting}
 *   error={deleteError}
 * />
 * ```
 */
export const DeleteProjectDialog = ({ isOpen, onClose, project, onDelete, isDeleting, error }: DeleteProjectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロジェクトの削除</DialogTitle>
          <DialogDescription>{PROJECT_MESSAGES.CONFIRM.deleteProject(project.name)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-red-600">{PROJECT_MESSAGES.CONFIRM.DELETE_PROJECT_WARNING}</p>

          <div className="rounded-md bg-muted p-4 text-sm">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 font-medium">ID:</span>
                <span>{project.id}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">プロジェクト名:</span>
                <span>{project.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">説明:</span>
                <span>{project.description || "なし"}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">状態:</span>
                <span>{project.is_active ? "アクティブ" : "非アクティブ"}</span>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
