import { authHandlers } from './handlers/api/v1/sample/auth-handlers';
import { chatHandlers } from './handlers/api/v1/sample/chat-handlers';
import { fileHandlers } from './handlers/api/v1/sample/file-handlers';
import { userHandlers } from './handlers/api/v1/sample/user-handlers';

/**
 * MSW (Mock Service Worker) リクエストハンドラー
 *
 * 開発環境でAPIリクエストをモックするためのハンドラー定義。
 * 各ハンドラーは特定のエンドポイントとHTTPメソッドに対応します。
 *
 * @see https://mswjs.io/docs/basics/request-handler
 */

/**
 * 全てのハンドラーを統合
 *
 * 機能ごとにファイルを分割し、ここで統合します。
 * 新しいハンドラーを追加する場合は、対応するファイルを作成してインポートしてください。
 *
 * 各ハンドラーファイルでは /api/v1 プレフィックスを含めたパスを定義しています。
 *
 * @example
 * ```ts
 * import { postHandlers } from './handlers/api/v1/post-handlers'
 * export const handlers = [...authHandlers, ...userHandlers, ...postHandlers]
 * ```
 */
export const handlers = [
  ...authHandlers, // サンプル認証関連 (/api/v1/sample/auth/*)
  ...userHandlers, // サンプルユーザー管理 (/api/v1/sample/users/*)
  ...fileHandlers, // サンプルファイル操作 (/api/v1/sample/files/*)
  ...chatHandlers, // サンプルチャット (/api/v1/sample/chat/*)
];
