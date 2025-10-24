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
 * <Link href={paths.sample.users.detail.getHref('123')}>User Detail</Link>
 * <Link href={paths.sample.users.edit.getHref('123')}>Edit User</Link>
 * ```
 */
export const paths = {
  /**
   * ホームページ
   */
  home: {
    getHref: () => '/',
  },

  /**
   * サンプルページ（デモ・参考実装）
   */
  sample: {
    /**
     * サンプルフォーム
     */
    form: {
      getHref: () => '/sample-form',
    },

    /**
     * サンプルログイン
     */
    login: {
      getHref: () => '/sample-login',
    },

    /**
     * サンプルページリスト
     */
    pageList: {
      getHref: () => '/sample-page-list',
    },

    /**
     * ユーザー管理サンプル
     */
    users: {
      /**
       * ユーザー一覧
       */
      list: {
        getHref: () => '/sample-users',
      },

      /**
       * 新規ユーザー作成
       */
      create: {
        getHref: () => '/sample-users/new',
      },

      /**
       * ユーザー詳細
       * @param id - ユーザーID
       */
      detail: {
        getHref: (id: string) => `/sample-users/${id}`,
      },

      /**
       * ユーザー編集
       * @param id - ユーザーID
       */
      edit: {
        getHref: (id: string) => `/sample-users/${id}/edit`,
      },

      /**
       * ユーザー削除
       * @param id - ユーザーID
       */
      delete: {
        getHref: (id: string) => `/sample-users/${id}/delete`,
      },
    },
  },
} as const;
