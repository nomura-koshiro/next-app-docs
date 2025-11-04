/**
 * プロジェクト管理機能のメッセージ定数
 *
 * エラーメッセージ、成功メッセージ、確認メッセージなど、
 * ユーザーに表示されるメッセージを一元管理します。
 *
 * @module features/projects/constants/messages
 */

export const PROJECT_MESSAGES = {
  /**
   * エラーメッセージ
   */
  ERRORS: {
    CREATE_FAILED: "プロジェクトの作成に失敗しました",
    UPDATE_FAILED: "プロジェクトの更新に失敗しました",
    DELETE_FAILED: "プロジェクトの削除に失敗しました",
    FETCH_FAILED: "プロジェクトの取得に失敗しました",
    MEMBER_ADD_FAILED: "メンバーの追加に失敗しました",
    MEMBER_REMOVE_FAILED: "メンバーの削除に失敗しました",
    MEMBER_UPDATE_FAILED: "メンバーロールの更新に失敗しました",
  },

  /**
   * 成功メッセージ
   */
  SUCCESS: {
    CREATED: "プロジェクトを作成しました",
    UPDATED: "プロジェクトを更新しました",
    DELETED: "プロジェクトを削除しました",
    MEMBER_ADDED: "メンバーを追加しました",
    MEMBER_REMOVED: "メンバーを削除しました",
    MEMBER_UPDATED: "メンバーロールを更新しました",
  },

  /**
   * 確認メッセージ
   */
  CONFIRM: {
    deleteProject: (projectName: string) => `プロジェクト「${projectName}」を削除しますか？`,
    DELETE_PROJECT_WARNING: "この操作は取り消せません。",
    deleteMember: (memberName: string) => `「${memberName}」をプロジェクトから削除しますか？`,
  },
} as const;
