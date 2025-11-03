/**
 * プロジェクト管理機能の型定義
 *
 * @module features/projects/types
 */

// ================================================================================
// グローバル型の再エクスポート
// ================================================================================

export type { Project } from "@/types/models/project";
export type { SystemRole, User } from "@/types/models/user";
export { isSystemRole, SYSTEM_ROLES } from "@/types/models/user";

// ================================================================================
// Zodスキーマからの型インポート
// ================================================================================

/**
 * Zodスキーマから型を推論してエクスポート
 *
 * スキーマ定義は /features/projects/schemas/index.ts に集約されています。
 * 型とバリデーションロジックを単一の情報源で管理します（DRY原則）。
 */
import type {
  AddProjectMemberInput as ZodAddProjectMemberInput,
  BulkAddMembersInput as ZodBulkAddMembersInput,
  BulkUpdateMembersInput as ZodBulkUpdateMembersInput,
  ProjectMember as ZodProjectMember,
  ProjectRole as ZodProjectRole,
  UpdateMemberRoleInput as ZodUpdateMemberRoleInput,
} from "../schemas";

export type AddProjectMemberInput = ZodAddProjectMemberInput;
export type BulkAddMembersInput = ZodBulkAddMembersInput;
export type BulkUpdateMembersInput = ZodBulkUpdateMembersInput;
export type ProjectMember = ZodProjectMember;
export type ProjectRole = ZodProjectRole;
export type UpdateMemberRoleInput = ZodUpdateMemberRoleInput;

export {
  addProjectMemberInputSchema,
  bulkUpdateMembersInputSchema,
  projectMemberSchema,
  projectRoleSchema,
  updateMemberRoleInputSchema,
} from "../schemas";

// ================================================================================
// プロジェクト機能固有の型定義
// ================================================================================

/**
 * プロジェクトレベルのロール定数（4段階）
 *
 * UI選択肢などで使用する定数値
 */
export const PROJECT_ROLES = {
  /** プロジェクトマネージャー（最高権限） */
  PROJECT_MANAGER: "project_manager",

  /** 権限管理者（メンバー管理担当） */
  PROJECT_MODERATOR: "project_moderator",

  /** メンバー（編集権限） */
  MEMBER: "member",

  /** 閲覧者（閲覧のみ） */
  VIEWER: "viewer",
} as const;

/**
 * ProjectRoleの型ガード関数
 */
export const isProjectRole = (value: unknown): value is (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES] => {
  return Object.values(PROJECT_ROLES).includes(value as (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES]);
};

/**
 * プロジェクトロール選択肢の型
 */
export type ProjectRoleOption = {
  value: (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES];
  label: string;
  description: string;
};

/**
 * プロジェクトロール選択肢の定数
 *
 * UIコンポーネントでのロール選択に使用します。
 */
export const PROJECT_ROLE_OPTIONS: readonly ProjectRoleOption[] = [
  {
    value: PROJECT_ROLES.PROJECT_MANAGER,
    label: "プロジェクトマネージャー",
    description: "プロジェクトの全権限を持つ",
  },
  {
    value: PROJECT_ROLES.PROJECT_MODERATOR,
    label: "権限管理者",
    description: "メンバー管理とロール変更が可能",
  },
  {
    value: PROJECT_ROLES.MEMBER,
    label: "メンバー",
    description: "プロジェクトの編集権限を持つ",
  },
  {
    value: PROJECT_ROLES.VIEWER,
    label: "閲覧者",
    description: "閲覧のみ可能",
  },
] as const;

/**
 * 権限の種類
 */
export type Permission =
  // プロジェクトレベル権限
  | "project:view"
  | "project:edit"
  | "project:delete"
  | "project:manage_members"
  | "project:manage_settings"
  // システムレベル権限
  | "system:admin"
  | "system:manage_users"
  | "system:view_audit_logs";

// ================================================================================
// イベントハンドラー型
// ================================================================================

/**
 * メンバーロール変更ハンドラー型
 */
export type MemberRoleChangeHandler = (memberId: string, newRole: ProjectRole) => void;

/**
 * メンバー削除ハンドラー型
 */
export type MemberRemoveHandler = (memberId: string) => void;

/**
 * ロール保存ハンドラー型
 */
export type RoleSaveHandler = (newRole: ProjectRole) => void;
