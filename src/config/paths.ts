/**
 * アプリケーション全体のルーティングパスを集中管理
 *
 * 型安全なURL生成を提供し、ハードコーディングされたパスを防ぎます。
 * 各ルートは`getHref()`メソッドを持ち、必要に応じてパラメータを受け取ります。
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <Link href={paths.home.getHref()}>Home</Link>
 *
 * // パラメータ付き
 * <Link href={paths.app.user.getHref('123')}>User Profile</Link>
 *
 * // リダイレクト付き認証
 * router.push(paths.auth.login.getHref('/app/dashboard'))
 * ```
 */
export const paths = {
  /**
   * ホームページ
   */
  home: {
    getHref: () => "/",
  },

  /**
   * 認証関連のパス
   */
  auth: {
    /**
     * ユーザー登録ページ
     * @param redirectTo - 登録後のリダイレクト先URL
     */
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo !== undefined && redirectTo !== null && redirectTo !== "" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },

    /**
     * ログインページ
     * @param redirectTo - ログイン後のリダイレクト先URL
     */
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo !== undefined && redirectTo !== null && redirectTo !== "" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },

    /**
     * ログアウト処理
     */
    logout: {
      getHref: () => "/auth/logout",
    },
  },

  /**
   * アプリケーション内のパス（認証が必要なエリア）
   */
  app: {
    /**
     * アプリケーションルート
     */
    root: {
      getHref: () => "/app",
    },

    /**
     * ダッシュボード
     */
    dashboard: {
      getHref: () => "/app/dashboard",
    },

    /**
     * プロフィールページ
     */
    profile: {
      getHref: () => "/app/profile",
    },

    /**
     * 設定ページ
     */
    settings: {
      getHref: () => "/app/settings",
    },
  },
} as const;
