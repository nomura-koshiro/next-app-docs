/**
 * 環境変数の型定義
 *
 * Next.jsの環境変数を型安全に使用するための型定義ファイルです。
 * 環境変数を追加した場合は、このファイルにも型定義を追加してください。
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

declare global {
  namespace NodeJS {
    type ProcessEnv = {
      /**
       * Node.jsの実行環境
       * - development: 開発環境
       * - production: 本番環境
       * - test: テスト環境
       */
      NODE_ENV: "development" | "production" | "test";

      /**
       * APIエンドポイントURL
       * クライアント・サーバー両方からアクセス可能
       *
       * @example "http://localhost:3000/api/v1"
       */
      NEXT_PUBLIC_API_URL: string;

      /**
       * MSWモックAPIの有効/無効フラグ
       * クライアント側でモックAPIを使用するかどうか
       *
       * @example "true" | "false"
       */
      NEXT_PUBLIC_ENABLE_API_MOCKING?: string;

      /**
       * アプリケーションURL
       * クライアント側でアプリケーションのベースURLとして使用
       *
       * @example "http://localhost:3000"
       */
      NEXT_PUBLIC_URL?: string;

      /**
       * モックAPIポート番号
       * クライアント側でモックAPIのポート番号として使用
       *
       * @example "8080"
       */
      NEXT_PUBLIC_MOCK_API_PORT?: string;

      /**
       * Storybookポート番号
       * Storybook環境でのみ設定される
       *
       * @example "6006"
       */
      NEXT_PUBLIC_STORYBOOK_PORT?: string;

      // ===== サーバー専用の環境変数 =====
      // 以下の環境変数はサーバー側でのみアクセス可能です
      // クライアント側で使用する場合は NEXT_PUBLIC_ プレフィックスを付けてください

      /**
       * データベース接続URL（サーバー専用）
       * クライアント側では undefined になります
       *
       * @example "postgresql://user:password@localhost:5432/db"
       */
      DATABASE_URL?: string;

      /**
       * APIシークレットキー（サーバー専用）
       * 外部APIへのアクセスに使用
       *
       * @example "sk_live_..."
       */
      SECRET_API_KEY?: string;

      /**
       * JWT シークレットキー（サーバー専用）
       * 認証トークンの生成・検証に使用
       */
      JWT_SECRET?: string;

      /**
       * セッションシークレットキー（サーバー専用）
       * セッションの暗号化に使用
       */
      SESSION_SECRET?: string;
    };
  }
}

/**
 * 型定義のエクスポート
 * このファイルは型定義のみを提供し、実行時の値は提供しません
 */
export {};
