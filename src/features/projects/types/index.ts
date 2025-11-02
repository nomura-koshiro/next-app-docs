/**
 * プロジェクト管理機能の型定義
 *
 * @module features/projects/types
 */

/**
 * システムレベルのロール
 */
export enum SystemRole {
  SYSTEM_ADMIN = "system_admin",
  USER = "user",
}

/**
 * プロジェクトレベルのロール（4段階）
 */
export enum ProjectRole {
  /** プロジェクトマネージャー（最高権限） */
  PROJECT_MANAGER = "project_manager",

  /** 権限管理者（メンバー管理担当） */
  PROJECT_MODERATOR = "project_moderator",

  /** メンバー（編集権限） */
  MEMBER = "member",

  /** 閲覧者（閲覧のみ） */
  VIEWER = "viewer",
}

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

/**
 * ユーザー情報
 */
export type User = {
  id: string;
  azure_oid: string;
  email: string;
  display_name: string | null;
  roles: SystemRole[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
};

/**
 * プロジェクト情報
 */
export type Project = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
};

/**
 * プロジェクトメンバー情報
 */
export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  joined_at: string;
  updated_at: string;
  user?: User;
  project?: Project;
};

/**
 * プロジェクトメンバー一覧のレスポンス
 */
export type ProjectMembersResponse = {
  data: ProjectMember[];
};

/**
 * プロジェクトメンバー詳細のレスポンス
 */
export type ProjectMemberResponse = {
  data: ProjectMember;
};

/**
 * プロジェクトメンバー追加DTO
 */
export type AddProjectMemberDTO = {
  user_id: string;
  role: ProjectRole;
};

/**
 * プロジェクトメンバー複数追加DTO
 */
export type BulkAddMembersDTO = {
  members: Array<{
    user_id: string;
    role: ProjectRole;
  }>;
};

/**
 * プロジェクトメンバーロール更新DTO
 */
export type UpdateMemberRoleDTO = {
  role: ProjectRole;
};

/**
 * プロジェクトメンバー複数ロール更新DTO
 */
export type BulkUpdateRolesDTO = {
  updates: Array<{
    member_id: string;
    role: ProjectRole;
  }>;
};

/**
 * エラーレスポンス
 */
export type ErrorResponse = {
  message: string;
  detail?: string;
};
