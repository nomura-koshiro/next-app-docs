// ================================================================================
// Imports
// ================================================================================

'use client';

import { Component, type ReactNode } from 'react';

import { Button } from '@/components/sample-ui/button/button';

// ================================================================================
// 型定義
// ================================================================================

type ErrorBoundaryProps = {
  /** レンダリングする子要素 */
  children: ReactNode;
  /** エラー発生時のフォールバックUI（オプション） */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  /** リセット時のリダイレクト先（デフォルト: '/login'） */
  redirectTo?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * エラー境界コンポーネント
 *
 * React コンポーネントツリー内のエラーをキャッチし、適切なフォールバックUIを表示します。
 * カスタムフォールバックUIを提供することも、デフォルトのUIを使用することもできます。
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * @example カスタムフォールバック
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, resetError) => (
 *     <div>
 *       <h1>エラーが発生しました</h1>
 *       <p>{error.message}</p>
 *       <button onClick={resetError}>リトライ</button>
 *     </div>
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    const redirectTo = this.props.redirectTo ?? '/login';
    window.location.href = redirectTo;
  };

  render() {
    if (this.state.hasError && this.state.error !== null) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (this.props.fallback !== undefined) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // デフォルトのフォールバックUI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-red-600">エラーが発生しました</h1>
              <p className="text-gray-600">{this.state.error.message || '予期しないエラーが発生しました'}</p>
            </div>
            <div className="space-y-4">
              <Button onClick={this.handleReset} className="w-full" size="lg">
                ページをリロード
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
