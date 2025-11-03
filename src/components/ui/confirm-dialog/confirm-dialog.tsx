"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログのメッセージ */
  message: string;
  /** 確認ボタンのテキスト（デフォルト: '確認'） */
  confirmText?: string;
  /** キャンセルボタンのテキスト（デフォルト: 'キャンセル'） */
  cancelText?: string;
  /** 確認ボタンの種類（デフォルト: 'danger'） */
  confirmType?: "danger" | "primary";
  /** 確認ボタンがクリックされたときのコールバック */
  onConfirm: () => void;
  /** キャンセルまたは閉じるボタンがクリックされたときのコールバック */
  onCancel: () => void;
};

/**
 * 確認ダイアログコンポーネント
 *
 * 重要なアクション（削除など）の確認に使用するモーダルダイアログ。
 *
 * @param props - ConfirmDialogコンポーネントのプロパティ
 * @returns 確認ダイアログ要素
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   title="メンバーを削除"
 *   message="このメンバーを削除してもよろしいですか？"
 *   confirmText="削除"
 *   confirmType="danger"
 *   onConfirm={() => deleteMember()}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
export const ConfirmDialog = ({
  title,
  message,
  confirmText = "確認",
  cancelText = "キャンセル",
  confirmType = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  // Escapeキーでダイアログを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const confirmButtonClass =
    confirmType === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      data-testid="confirm-dialog"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="confirm-dialog-content"
      >
        <h2 id="dialog-title" className="mb-4 text-xl font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            data-testid="confirm-dialog-cancel"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
            data-testid="confirm-dialog-confirm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
