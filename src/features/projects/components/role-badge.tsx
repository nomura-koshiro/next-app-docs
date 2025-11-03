import type { ProjectRole } from "../types";

type RoleBadgeProps = {
  role: ProjectRole;
  className?: string;
};

/**
 * プロジェクトロールを表示するバッジコンポーネント
 *
 * @param role プロジェクトロール
 * @param className 追加のCSSクラス
 *
 * @example
 * ```tsx
 * <RoleBadge role={ProjectRole.PROJECT_MANAGER} />
 * <RoleBadge role={ProjectRole.MEMBER} className="ml-2" />
 * ```
 */
export const RoleBadge = ({ role, className = "" }: RoleBadgeProps) => {
  const getRoleConfig = (role: ProjectRole) => {
    switch (role) {
      case "project_manager":
        return {
          label: "プロジェクトマネージャー",
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-200",
        };
      case "project_moderator":
        return {
          label: "権限管理者",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "member":
        return {
          label: "メンバー",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "viewer":
        return {
          label: "閲覧者",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
      default:
        return {
          label: role,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.label}
    </span>
  );
};
