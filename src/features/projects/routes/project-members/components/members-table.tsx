"use client";

import { useState } from "react";

import { Button } from "@/components/sample-ui/button";

import { RoleBadge } from "../../../components/role-badge";
import { type ProjectMember, type ProjectRole } from "../../../types";
import { DeleteMemberDialog } from "./delete-member-dialog";
import { EditRoleDialog } from "./edit-role-dialog";

type MembersTableProps = {
  members: ProjectMember[];
  onRoleChange?: (memberId: string, newRole: ProjectRole) => void;
  onRemoveMember?: (memberId: string) => void;
  isLoading?: boolean;
};

/**
 * プロジェクトメンバー一覧テーブルコンポーネント
 *
 * @param members プロジェクトメンバー一覧
 * @param onRoleChange ロール変更ハンドラー
 * @param onRemoveMember メンバー削除ハンドラー
 * @param isLoading ローディング状態
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
export const MembersTable = ({ members, onRoleChange, onRemoveMember, isLoading = false }: MembersTableProps) => {
  // ================================================================================
  // State
  // ================================================================================
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<ProjectMember | null>(null);

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleEditClick = (member: ProjectMember) => {
    setEditingMember(member);
  };

  const handleDeleteClick = (member: ProjectMember) => {
    setDeletingMember(member);
  };

  const handleRoleUpdate = (memberId: string, newRole: ProjectRole) => {
    if (onRoleChange) {
      onRoleChange(memberId, newRole);
    }
  };

  const handleMemberDelete = (memberId: string) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">プロジェクトメンバーがいません</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
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
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.user?.display_name || "Unknown User"}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">{member.user?.email || "N/A"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <RoleBadge role={member.role} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(member.joined_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onRoleChange && (
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(member)}>
                        編集
                      </Button>
                    )}
                    {onRemoveMember && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(member)}>
                        削除
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ロール編集ダイアログ */}
      <EditRoleDialog isOpen={!!editingMember} onClose={() => setEditingMember(null)} member={editingMember} onUpdate={handleRoleUpdate} />

      {/* メンバー削除ダイアログ */}
      <DeleteMemberDialog
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        member={deletingMember}
        onDelete={handleMemberDelete}
      />
    </>
  );
};
