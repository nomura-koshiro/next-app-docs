/**
 * API関連の共通型定義
 */

/**
 * APIエラーレスポンス型
 *
 * バックエンドAPIから返されるエラー情報の共通フォーマット
 */
export type ApiErrorResponse = {
  /** エラーメッセージ */
  message: string;
  /** 詳細情報（オプション） */
  detail?: string;
  /** エラーコード（オプション） */
  code?: string;
  /** フィールドごとのバリデーションエラー（オプション） */
  errors?: Record<string, string[]>;
};
