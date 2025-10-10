/**
 * アプリケーション全体で使用する定数定義
 *
 * バリデーション、設定値、マジックナンバーなどを集中管理します。
 */

/**
 * バリデーション関連の定数
 */
export const VALIDATION = {
  // ユーザー名
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,

  // メールアドレス
  EMAIL_MAX_LENGTH: 255,

  // パスワード
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 72,

  // 年齢
  AGE_MIN: 0,
  AGE_MAX: 150,

  // テキストエリア
  TEXTAREA_MAX_LENGTH: 1000,

  // その他
  PHONE_PATTERN: /^[0-9]{10,11}$/,
  URL_PATTERN: /^https?:\/\/.+/,
} as const;

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
