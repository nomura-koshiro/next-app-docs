import type { NextConfig } from "next";

/**
 * Next.js設定
 *
 * アプリケーション全体の設定を定義します。
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  /**
   * 画像最適化設定
   * 外部ドメインから画像を読み込む場合は remotePatterns を設定
   */
  images: {
    remotePatterns: [
      // 外部画像を使用する場合はここに追加
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // },
    ],
  },

  /**
   * 厳格なReact設定
   * 開発時の二重レンダリングでバグを早期発見
   */
  reactStrictMode: true,

  /**
   * 本番ビルド時のソースマップ生成
   * デバッグ用（本番環境では false にすることを推奨）
   */
  productionBrowserSourceMaps: false,

  /**
   * ページ拡張子設定
   * TypeScriptとJavaScriptファイルをページとして認識
   */
  pageExtensions: ["tsx", "ts", "jsx", "js"],

  /**
   * 実験的機能の設定
   */
  experimental: {
    // 必要に応じて実験的機能を有効化
    // typedRoutes: true, // 型安全なルーティング
  },

  /**
   * ヘッダー設定
   * セキュリティヘッダーやキャッシュ制御
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
