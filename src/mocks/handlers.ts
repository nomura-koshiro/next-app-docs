import { http, HttpResponse } from "msw";

/**
 * MSW (Mock Service Worker) リクエストハンドラー
 *
 * 開発環境でAPIリクエストをモックするためのハンドラー定義。
 * 各ハンドラーは特定のエンドポイントとHTTPメソッドに対応します。
 *
 * @see https://mswjs.io/docs/basics/request-handler
 */
export const handlers = [
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

  // 以下に必要なAPIハンドラーを追加してください
  // 例:
  // http.get('/api/users', () => { ... }),
  // http.post('/api/users', async ({ request }) => { ... }),
];
