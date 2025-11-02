import type { ReactNode } from "react";

type EmptyStateProps = {
  /** タイトル（オプション） */
  title?: string;
  /** 説明文 */
  description: string;
  /** アクションボタン（オプション） */
  action?: ReactNode;
  /** 追加のCSSクラス */
  className?: string;
};

/**
 * 空状態表示コンポーネント
 *
 * データがない場合に表示するコンポーネント。
 *
 * @param props - EmptyStateコンポーネントのプロパティ
 * @param props.title - タイトル
 * @param props.description - 説明文
 * @param props.action - アクションボタン
 * @param props.className - 追加のCSSクラス
 * @returns 空状態表示要素
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="メンバーがいません"
 *   description="プロジェクトにメンバーを追加してください"
 *   action={<Button>メンバーを追加</Button>}
 * />
 * ```
 */
export const EmptyState = ({ title, description, action, className = "" }: EmptyStateProps) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-12 text-center ${className}`} data-testid="empty-state">
      {title !== undefined && <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>}
      <p className="text-gray-500">{description}</p>
      {action !== undefined && <div className="mt-4">{action}</div>}
    </div>
  );
};
