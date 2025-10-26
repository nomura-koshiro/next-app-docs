/**
 * サンプル認証API用のMSWハンドラー
 *
 * ログイン、ログアウト、ユーザー情報取得のモックを提供します。
 */

import { http, HttpResponse } from 'msw';

export const authHandlers = [
  /**
   * POST /api/v1/sample/auth/login
   * ログインリクエストのモック
   *
   * @param request - ログイン情報 (email, password)
   * @returns ユーザー情報とJWTトークン
   *
   * @example
   * テスト用の認証情報:
   * - email: 任意のメールアドレス
   * - password: 任意のパスワード（空でなければOK）
   */
  http.post('*/api/v1/sample/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // 簡易的な認証チェック（モック用）
    if (body.email && body.password) {
      // 成功レスポンス
      return HttpResponse.json({
        user: {
          id: '1',
          email: body.email,
          name: 'Sample User',
          role: 'user',
        },
        token: 'mock-jwt-token-' + Date.now(),
      });
    }

    // エラーレスポンス
    return HttpResponse.json(
      {
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),

  /**
   * POST /api/v1/sample/auth/logout
   * ログアウトリクエストのモック
   *
   * @returns 成功レスポンス
   */
  http.post('*/api/v1/sample/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  /**
   * GET /api/v1/sample/auth/me
   * 現在のユーザー情報取得のモック
   *
   * @param request - Authorization headerを確認
   * @returns ユーザー情報
   *
   * @example
   * Authorization header:
   * - 有効: "Bearer mock-jwt-token-xxxxx"
   * - 無効: headerなし or 不正なフォーマット
   */
  http.get('*/api/v1/sample/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // トークンチェック（モック用）
    if (authHeader !== null && authHeader !== undefined && authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({
        data: {
          id: '1',
          email: 'user@example.com',
          name: 'Sample User',
          role: 'user',
        },
      });
    }

    // 認証エラー
    return HttpResponse.json(
      {
        message: 'Unauthorized',
      },
      { status: 401 }
    );
  }),
];
