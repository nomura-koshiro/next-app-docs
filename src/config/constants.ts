/**
 * アプリケーション全体で使用する定数定義
 *
 * 設定値、マジックナンバーなどを集中管理します。
 */

/**
 * API関連の定数
 */
export const API = {
  TIMEOUT: 30000, // 30秒
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1秒
} as const;

/**
 * ページネーション関連の定数
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
} as const;
