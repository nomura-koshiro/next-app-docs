import { Button } from "@/components/sample-ui/button";

/**
 * メインエラーフォールバックコンポーネント
 *
 * ErrorBoundaryでキャッチされたエラーを表示するフォールバックUI。
 * アプリケーション全体で予期しないエラーが発生した際に表示されます。
 *
 * 機能:
 * - フルスクリーンエラー表示
 * - ページリフレッシュボタン
 * - アクセシビリティ対応（role="alert"）
 *
 * @example
 * ```tsx
 * <ErrorBoundary FallbackComponent={MainErrorFallback}>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @see https://github.com/bvaughn/react-error-boundary
 */
export const MainErrorFallback = (): React.ReactElement => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-red-500" role="alert">
      <h2 className="text-lg font-semibold">予期しないエラーが発生しました</h2>
      <p className="mt-2 text-sm text-gray-600">
        申し訳ございません。アプリケーションで問題が発生しました。
        <br />
        ページを再読み込みしてもう一度お試しください。
      </p>
      <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        再読み込み
      </Button>
    </div>
  );
};
