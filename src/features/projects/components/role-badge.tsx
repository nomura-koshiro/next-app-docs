import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn";

import type { ProjectRole } from "../types";

// ================================================================================
// 定数
// ================================================================================

/**
 * ロール名の表示ラベル
 */
const ROLE_LABELS: Record<ProjectRole, string> = {
  project_manager: "プロジェクトマネージャー",
  project_moderator: "権限管理者",
  member: "メンバー",
  viewer: "閲覧者",
} as const;

/**
 * ロールバッジのスタイルバリアント
 *
 * CVAを使用してロールごとの色を定義
 */
const roleBadgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", {
  variants: {
    role: {
      project_manager: "bg-purple-100 text-purple-800 border-purple-200",
      project_moderator: "bg-blue-100 text-blue-800 border-blue-200",
      member: "bg-green-100 text-green-800 border-green-200",
      viewer: "bg-gray-100 text-gray-800 border-gray-200",
    },
  },
  defaultVariants: {
    role: "viewer",
  },
});

// ================================================================================
// 型定義
// ================================================================================

export type RoleBadgeProps = {
  /** プロジェクトロール */
  role: ProjectRole;
  /** 追加のCSSクラス */
  className?: string;
};

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * プロジェクトロールを表示するバッジコンポーネント
 *
 * CVAを使用してロールごとの色を管理し、パフォーマンスを最適化。
 *
 * @param role プロジェクトロール
 * @param className 追加のCSSクラス
 *
 * @example
 * ```tsx
 * import { PROJECT_ROLES } from '@/features/projects/types';
 *
 * <RoleBadge role={PROJECT_ROLES.PROJECT_MANAGER} />
 * <RoleBadge role={PROJECT_ROLES.MEMBER} className="ml-2" />
 * ```
 */
export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  return (
    <span className={cn(roleBadgeVariants({ role }), className)} data-testid={`role-badge-${role}`}>
      {ROLE_LABELS[role]}
    </span>
  );
};
