// ================================================================================
// Imports
// ================================================================================

// (No external imports required)

// ================================================================================
// 型定義
// ================================================================================

type LoadingSpinnerProps = {
  /** ローディングメッセージ (デフォルト: '読み込み中...') */
  message?: string;
  /** 全画面表示するかどうか (デフォルト: true) */
  fullScreen?: boolean;
};

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * ローディングスピナーコンポーネント
 *
 * 認証チェック、データ読み込み時などに使用する共通のローディング表示コンポーネント。
 *
 * @param props - LoadingSpinnerコンポーネントのプロパティ
 * @param props.message - ローディングメッセージ
 * @param props.fullScreen - 全画面表示するかどうか
 * @returns ローディングスピナー要素
 */
export const LoadingSpinner = ({ message = '読み込み中...', fullScreen = true }: LoadingSpinnerProps) => {
  // ================================================================================
  // 変数
  // ================================================================================
  const containerClass = fullScreen ? 'flex min-h-screen items-center justify-center' : 'flex items-center justify-center';

  // ================================================================================
  // Render
  // ================================================================================
  return (
    <div className={containerClass}>
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" aria-hidden="true" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};
