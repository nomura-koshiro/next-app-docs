import { LoadingSpinner } from '@/components/sample-ui/loading-spinner';

/**
 * ローディングコンポーネント
 *
 * ページ遷移時やデータ読み込み時に表示されるローディングUI。
 * Next.js App Routerの自動ローディングUI機能を使用しています。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function Loading() {
  return <LoadingSpinner fullScreen />;
}
