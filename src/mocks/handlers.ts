import { azureAuthHandlers } from "./handlers/api/v1/auth/auth-handlers";
import { projectHandlers } from "./handlers/api/v1/projects/project-handlers";
import { projectMemberHandlers } from "./handlers/api/v1/projects/project-member-handlers";
import { sampleAuthHandlers } from "./handlers/api/v1/sample-auth/sample-auth-handlers";
import { sampleChatHandlers } from "./handlers/api/v1/sample-chat/sample-chat-handlers";
import { sampleFileHandlers } from "./handlers/api/v1/sample-file/sample-file-handlers";
import { sampleUserHandlers } from "./handlers/api/v1/sample-users/sample-user-handlers";

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
  ...azureAuthHandlers, // Azure AD認証関連 (/auth/*)
  ...projectHandlers, // プロジェクト管理 (/api/v1/projects/*)
  ...projectMemberHandlers, // プロジェクトメンバー管理 (/api/v1/projects/*/members/*)
  ...sampleAuthHandlers, // サンプル認証関連 (/api/v1/sample/auth/*)
  ...sampleUserHandlers, // サンプルユーザー管理 (/api/v1/sample/users/*)
  ...sampleFileHandlers, // サンプルファイル操作 (/api/v1/sample/files/*)
  ...sampleChatHandlers, // サンプルチャット (/api/v1/sample/chat/*)
];
