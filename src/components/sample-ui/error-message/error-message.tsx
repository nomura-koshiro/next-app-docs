import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/sample-ui/alert';

/**
 * ErrorMessageコンポーネントのプロパティ
 */
type ErrorMessageProps = {
  /** エラーのタイトル（デフォルト: "エラー"） */
  title?: string;
  /** エラーメッセージ */
  message: string;
  /** フルスクリーン表示にするか（デフォルト: false） */
  fullScreen?: boolean;
};

/**
 * エラーメッセージコンポーネント
 *
 * エラーアラートを表示するための汎用コンポーネント。
 * フルスクリーン表示とインライン表示の2つのモードをサポートします。
 *
 * 機能:
 * - 破壊的バリアントのアラート表示
 * - アラートサークルアイコン
 * - フルスクリーン中央配置オプション
 *
 * @example
 * ```tsx
 * // インライン表示
 * <ErrorMessage message="データの読み込みに失敗しました" />
 *
 * // フルスクリーン表示
 * <ErrorMessage
 *   title="致命的なエラー"
 *   message="システムエラーが発生しました"
 *   fullScreen={true}
 * />
 * ```
 *
 * @param props - ErrorMessageコンポーネントのプロパティ
 * @returns エラーメッセージ要素
 */
export function ErrorMessage({ title = 'エラー', message, fullScreen = false }: ErrorMessageProps) {
  // アラートコンテンツ
  const alertContent = (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  // フルスクリーン表示の場合
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">{alertContent}</div>
      </div>
    );
  }

  // インライン表示の場合
  return alertContent;
}
