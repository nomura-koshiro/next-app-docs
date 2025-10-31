import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * テキストエリアコンポーネント
 *
 * shadcn/uiベースの複数行テキスト入力フィールド。
 * 長文入力に適したテキストエリアコンポーネントです。
 *
 * 機能:
 * - 最小高さ80px
 * - フォーカス時のリングスタイル
 * - プレースホルダースタイル
 * - 無効化状態のスタイル
 *
 * @example
 * ```tsx
 * <Textarea placeholder="コメントを入力してください" rows={5} />
 * ```
 *
 * @param props - HTMLTextAreaElementのプロパティ
 * @returns テキストエリア要素
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
