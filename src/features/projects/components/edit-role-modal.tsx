"use client";

import { useEffect, useState } from "react";

import type { ProjectMember, ProjectRole } from "../types";
import { PROJECT_ROLE_OPTIONS } from "../types";
import { RoleBadge } from "./role-badge";

export type EditRoleModalProps = {
  /** 編集対象のメンバー */
  member: ProjectMember;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** ロール変更を保存するコールバック */
  onSave: (newRole: ProjectRole) => void;
};

/**
 * ロール編集モーダルコンポーネント
 *
 * プロジェクトメンバーのロールを変更するためのモーダルダイアログ。
 *
 * @param props - EditRoleModalコンポーネントのプロパティ
 * @returns ロール編集モーダル要素
 *
 * @example
 * ```tsx
 * <EditRoleModal
 *   member={member}
 *   onClose={() => setEditingMember(null)}
 *   onSave={(newRole) => updateRole(member.id, newRole)}
 * />
 * ```
 */
export const EditRoleModal = ({ member, onClose, onSave }: EditRoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(member.role);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSave = () => {
    onSave(selectedRole);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-role-title"
      data-testid="edit-role-modal"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="edit-role-modal-content"
      >
        <h2 id="edit-role-title" className="mb-2 text-xl font-semibold text-gray-900">
          ロールを編集
        </h2>
        <p className="mb-6 text-sm text-gray-600">{member.user?.display_name ?? "Unknown User"} のロールを変更します</p>

        <div className="space-y-3">
          {PROJECT_ROLE_OPTIONS.map((role) => (
            <label
              key={role.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                selectedRole === role.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              data-testid={`role-option-${role.value}`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
                className="mt-1"
                aria-label={`${role.label}を選択`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{role.label}</span>
                  <RoleBadge role={role.value} />
                </div>
                <p className="mt-1 text-sm text-gray-600">{role.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            data-testid="edit-role-cancel"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedRole === member.role}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="edit-role-save"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
