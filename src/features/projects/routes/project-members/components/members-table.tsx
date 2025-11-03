"use client";

import { RoleBadge } from "../../../components/role-badge";
import type { ProjectMember, ProjectRole } from "../../../types";
import { ProjectRoleInputSchema } from "../schemas/role-input.schema";

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
                    <button
                      type="button"
                      onClick={() => {
                        const userInput = prompt("新しいロールを選択してください\n(project_manager, project_moderator, member, viewer)");
                        if (userInput) {
                          // ✅ Zodスキーマでバリデーション（危険なユーザー入力を検証）
                          const result = ProjectRoleInputSchema.safeParse(userInput);
                          if (result.success) {
                            onRoleChange(member.id, result.data as ProjectRole);
                          } else {
                            alert(
                              "無効なロールです。以下のいずれかを入力してください:\nproject_manager, project_moderator, member, viewer"
                            );
                          }
                        }
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      編集
                    </button>
                  )}
                  {onRemoveMember && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("このメンバーを削除しますか？")) {
                          onRemoveMember(member.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
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
  );
};
