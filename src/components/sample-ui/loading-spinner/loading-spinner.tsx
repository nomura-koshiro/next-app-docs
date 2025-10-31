/**
 * LoadingSpinnerコンポーネントのプロパティ
 */
type LoadingSpinnerProps = {
  /** ローディングテキスト（デフォルト: "読み込み中..."） */
  text?: string;
  /** テキストのサイズ（デフォルト: "md"） */
  size?: "sm" | "md" | "lg";
  /** フルスクリーン表示にするか（デフォルト: false） */
  fullScreen?: boolean;
};

/**
 * ローディングスピナーコンポーネント
 *
 * データ読み込み中などの処理待ち状態を示すスピナーUI。
 * アニメーション付きの回転スピナーとテキストを表示します。
 *
 * 機能:
 * - 回転アニメーション
 * - カスタマイズ可能なテキストとサイズ
 * - フルスクリーン表示オプション
 * - テストID付き（data-testid="loading-spinner"）
 *
 * @example
 * ```tsx
 * // インライン表示
 * <LoadingSpinner text="データを取得中..." size="sm" />
 *
 * // フルスクリーン表示
 * <LoadingSpinner fullScreen={true} />
 * ```
 *
 * @param props - LoadingSpinnerコンポーネントのプロパティ
 * @returns ローディングスピナー要素
 */
export function LoadingSpinner({ text = "読み込み中...", size = "md", fullScreen = false }: LoadingSpinnerProps) {
  /** テキストサイズに対応するCSSクラスのマッピング */
  const sizeClasses = {
    sm: "text-base", // 16px
    md: "text-lg", // 18px
    lg: "text-xl", // 20px
  };

  // スピナーコンテンツ
  const content = (
    <div className="flex flex-col items-center justify-center gap-4" data-testid="loading-spinner">
      {/* 回転スピナー */}
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 h-12 w-12" />
      {/* ローディングテキスト */}
      <div className={sizeClasses[size]}>{text}</div>
    </div>
  );

  // フルスクリーン表示の場合
  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center">{content}</div>;
  }

  // インライン表示の場合
  return content;
}
