/**
 * 共通UIコンポーネント統合エクスポート
 *
 * @module components/ui
 *
 * @description
 * アプリケーション全体で使用する汎用UIコンポーネントを提供。
 * エラー境界、ローディングスピナーなどの基本コンポーネントを含む。
 *
 * @example
 * ```typescript
 * import { ErrorBoundary, LoadingSpinner } from '@/components/ui'
 *
 * // エラー境界でラップ
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // ローディング表示
 * {isLoading && <LoadingSpinner />}
 * ```
 */

// ================================================================================
// UI Components Exports
// ================================================================================

export * from "./error-boundary";
export * from "./loading-spinner";
