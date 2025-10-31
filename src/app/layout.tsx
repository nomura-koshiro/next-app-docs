import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProvider } from "./provider";

/**
 * Geist Sans フォント設定
 * CSS変数として --font-geist-sans を定義
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono フォント設定
 * CSS変数として --font-geist-mono を定義
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * メタデータ設定
 * ページタイトルとdescriptionを定義
 */
export const metadata: Metadata = {
  title: {
    default: "Plain Next.js Template",
    template: "%s | Plain Next.js Template",
  },
  description:
    "Next.js 15のApp Routerを使用したモダンなWebアプリケーションテンプレート。フォーム、認証、CRUD操作などの実装パターンを提供します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Plain Next.js Template",
  },
};

/**
 * ルートレイアウトコンポーネント
 *
 * アプリケーション全体のレイアウトを定義します。
 * - フォント設定（Geist Sans、Geist Mono）
 * - グローバルプロバイダー（MSW、React Query、ErrorBoundaryなど）
 * - 全ページ共通のHTML構造
 *
 * @param props - レイアウトのプロパティ
 * @param props.children - レンダリングするページコンテンツ
 * @returns アプリケーションのルートレイアウト
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
