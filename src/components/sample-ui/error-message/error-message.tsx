import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/sample-ui/alert";

type ErrorMessageProps = {
  title?: string;
  message: string;
  fullScreen?: boolean;
};

/**
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
 */
export function ErrorMessage({ title = "エラー", message, fullScreen = false }: ErrorMessageProps) {
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
