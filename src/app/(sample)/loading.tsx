import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

/**
 * サンプルページ用ローディングコンポーネント
 *
 * サンプルページグループ内の遷移時に表示されるローディングUI
 */
export default function Loading() {
  return <LoadingSpinner fullScreen />;
}
