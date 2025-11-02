"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { EditRoleModal } from "../../../components/edit-role-modal";
import { RoleBadge } from "../../../components/role-badge";
import type { ProjectMember, ProjectRole } from "../../../types";

export type MembersTableProps = {
  members: ProjectMember[];
  onRoleChange?: (memberId: string, newRole: ProjectRole) => void;
  onRemoveMember?: (memberId: string) => void;
};

/**
 * プロジェクトメンバー一覧テーブルコンポーネント
 *
 * @param members プロジェクトメンバー一覧
 * @param onRoleChange ロール変更ハンドラー
 * @param onRemoveMember メンバー削除ハンドラー
 *
 * @example
 * ```tsx
 * <MembersTable
 *   members={members}
 *   onRoleChange={(memberId, role) => console.log(memberId, role)}
 *   onRemoveMember={(memberId) => console.log(memberId)}
 * />
 * ```
 */
export const MembersTable = ({ members, onRoleChange, onRemoveMember }: MembersTableProps) => {
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const handleRoleSave = (newRole: ProjectRole) => {
    if (editingMember && onRoleChange) {
      onRoleChange(editingMember.id, newRole);
    }
    setEditingMember(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingMemberId && onRemoveMember) {
      onRemoveMember(deletingMemberId);
    }
    setDeletingMemberId(null);
  };

  const deletingMember = members.find((m) => m.id === deletingMemberId);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" data-testid="members-table">
        <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="プロジェクトメンバー一覧">
          <caption className="sr-only">プロジェクトメンバー一覧。各メンバーの名前、メールアドレス、ロール、参加日が表示されます。</caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ユーザー
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                メールアドレス
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ロール
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                参加日
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50" data-testid={`member-row-${member.id}`}>
                <td className="whitespace-nowrap px-6 py-4" data-testid={`member-name-${member.id}`}>
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.user?.display_name ?? "Unknown User"}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4" data-testid={`member-email-${member.id}`}>
                  <div className="text-sm text-gray-500">{member.user?.email ?? "N/A"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4" data-testid={`member-role-${member.id}`}>
                  <RoleBadge role={member.role} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500" data-testid={`member-joined-${member.id}`}>
                  {new Date(member.joined_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onRoleChange && (
                      <button
                        type="button"
                        onClick={() => setEditingMember(member)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`${member.user?.display_name}のロールを編集`}
                        data-testid={`edit-member-button-${member.id}`}
                      >
                        編集
                      </button>
                    )}
                    {onRemoveMember && (
                      <button
                        type="button"
                        onClick={() => setDeletingMemberId(member.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`${member.user?.display_name}を削除`}
                        data-testid={`delete-member-button-${member.id}`}
                      >
                        削除
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ロール編集モーダル */}
      {editingMember && <EditRoleModal member={editingMember} onClose={() => setEditingMember(null)} onSave={handleRoleSave} />}

      {/* 削除確認ダイアログ */}
      {deletingMember && (
        <ConfirmDialog
          title="メンバーを削除"
          message={`${deletingMember.user?.display_name ?? "このメンバー"}をプロジェクトから削除してもよろしいですか？`}
          confirmText="削除"
          confirmType="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMemberId(null)}
        />
      )}
    </>
  );
};
