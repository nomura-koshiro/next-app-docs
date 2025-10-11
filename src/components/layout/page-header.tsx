import { ReactNode } from "react";

/**
 * PageHeaderコンポーネントのプロパティ
 */
type PageHeaderProps = {
  /** ページのタイトル */
  title: string;
  /** ページの説明文（オプション） */
  description?: string;
  /** ヘッダー右側に表示するアクション要素（ボタンなど） */
  action?: ReactNode;
};

/**
 * ページヘッダーコンポーネント
 *
 * ページの上部に表示されるヘッダーセクション。
 * タイトル、説明文、アクションボタンなどを表示します。
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="ユーザー一覧"
 *   description="システムに登録されているユーザーの一覧です"
 *   action={<Button>新規作成</Button>}
 * />
 * ```
 *
 * @param props - PageHeaderコンポーネントのプロパティ
 * @returns ページヘッダー要素
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold">{title}</h1>
        {/* ページ説明文（存在する場合のみ表示） */}
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      {/* アクション要素（存在する場合のみ表示） */}
      {action !== undefined && <div>{action}</div>}
    </div>
  );
}
