import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * アラートのスタイルバリアント定義
 *
 * CVA（Class Variance Authority）を使用してアラートのスタイルを定義
 */
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        /** デフォルトのアラートスタイル */
        default: 'bg-card text-card-foreground',
        /** 破壊的操作や警告用のアラートスタイル */
        destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * アラートコンポーネント
 *
 * ユーザーに重要な情報を通知するためのアラートボックス。
 * アイコン、タイトル、説明文を含めることができます。
 *
 * @example
 * ```tsx
 * <Alert variant="destructive">
 *   <AlertCircle />
 *   <AlertTitle>エラー</AlertTitle>
 *   <AlertDescription>
 *     処理中にエラーが発生しました。
 *   </AlertDescription>
 * </Alert>
 * ```
 *
 * @param props - Divコンポーネントのプロパティとバリアント
 * @returns アラート要素
 */
function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

/**
 * アラートタイトルコンポーネント
 *
 * アラート内に表示されるタイトル要素。
 * 1行で切り捨てられ、太字で表示されます。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns アラートタイトル要素
 */
function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="alert-title" className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)} {...props} />
  );
}

/**
 * アラート説明コンポーネント
 *
 * アラート内に表示される詳細な説明文要素。
 * 複数行のテキストや段落を含めることができます。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns アラート説明要素
 */
function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
