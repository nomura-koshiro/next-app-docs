import { http, HttpResponse } from "msw";
import { authHandlers } from "./handlers/auth-handlers";

/**
 * MSW (Mock Service Worker) リクエストハンドラー
 *
 * 開発環境でAPIリクエストをモックするためのハンドラー定義。
 * 各ハンドラーは特定のエンドポイントとHTTPメソッドに対応します。
 *
 * @see https://mswjs.io/docs/basics/request-handler
 */

// サンプルハンドラー
const exampleHandlers = [
  /**
   * GET /api/example
   * サンプルGETリクエストのモック
   *
   * @returns メッセージとタイムスタンプを含むJSONレスポンス
   */
  http.get("/api/example", () => {
    return HttpResponse.json({
      message: "Hello from MSW!",
      timestamp: new Date().toISOString(),
    });
  }),

  /**
   * POST /api/example
   * サンプルPOSTリクエストのモック
   *
   * @param request - リクエストオブジェクト（リクエストボディを含む）
   * @returns 成功フラグと送信されたデータを含むJSONレスポンス
   */
  http.post("/api/example", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      data: body,
    });
  }),
];

/**
 * 全てのハンドラーを統合
 *
 * 機能ごとにファイルを分割し、ここで統合します。
 * 新しいハンドラーを追加する場合は、対応するファイルを作成してインポートしてください。
 *
 * @example
 * ```ts
 * import { userHandlers } from './user-handlers'
 * export const handlers = [...authHandlers, ...userHandlers, ...]
 * ```
 */
export const handlers = [
  ...authHandlers, // 認証関連
  ...exampleHandlers, // サンプル

  // 以下に必要なAPIハンドラーを追加してください
  // 例:
  // ...userHandlers,    // ユーザー管理
  // ...postHandlers,    // 投稿管理
];
