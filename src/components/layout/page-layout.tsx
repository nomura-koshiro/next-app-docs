import { ReactNode } from "react";

/**
 * PageLayoutコンポーネントのプロパティ
 */
type PageLayoutProps = {
  /** ページ内に表示するコンテンツ */
  children: ReactNode;
  /** コンテンツの最大幅（デフォルト: "6xl"） */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
};

/**
 * 最大幅に対応するTailwind CSSクラスのマッピング
 */
const maxWidthClasses = {
  sm: "max-w-sm", // 24rem (384px)
  md: "max-w-md", // 28rem (448px)
  lg: "max-w-lg", // 32rem (512px)
  xl: "max-w-xl", // 36rem (576px)
  "2xl": "max-w-2xl", // 42rem (672px)
  "4xl": "max-w-4xl", // 56rem (896px)
  "6xl": "max-w-6xl", // 72rem (1152px)
  full: "max-w-full", // 100%
};

/**
 * ページレイアウトコンポーネント
 *
 * アプリケーション全体のページレイアウトを提供します。
 * 背景色、パディング、コンテンツの最大幅を管理します。
 *
 * 機能:
 * - フルスクリーン高さ（min-h-screen）
 * - グレー背景（bg-gray-50）
 * - レスポンシブなコンテンツ幅制御
 * - 中央配置
 *
 * @example
 * ```tsx
 * <PageLayout maxWidth="4xl">
 *   <PageHeader title="ダッシュボード" />
 *   <main>コンテンツ</main>
 * </PageLayout>
 * ```
 *
 * @param props - PageLayoutコンポーネントのプロパティ
 * @returns ページレイアウト要素
 */
export function PageLayout({ children, maxWidth = "6xl" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* コンテンツコンテナ（中央配置 + 最大幅制御） */}
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>{children}</div>
    </div>
  );
}
