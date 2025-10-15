import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * カードコンポーネント
 *
 * コンテンツをグループ化して表示するためのカードコンテナ。
 * シャドウとボーダーを持つ角丸の箱型レイアウトを提供します。
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>タイトル</CardTitle>
 *     <CardDescription>説明文</CardDescription>
 *   </CardHeader>
 *   <CardContent>内容</CardContent>
 * </Card>
 * ```
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カード要素
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className)}
      {...props}
    />
  );
}

/**
 * カードヘッダーコンポーネント
 *
 * カードの上部に表示されるヘッダーセクション。
 * タイトル、説明文、アクションボタンを配置するためのグリッドレイアウトを提供します。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カードヘッダー要素
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

/**
 * カードタイトルコンポーネント
 *
 * カードヘッダー内に表示されるタイトル要素。
 * セミボールドフォントで強調表示されます。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カードタイトル要素
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props} />;
}

/**
 * カード説明コンポーネント
 *
 * カードヘッダー内に表示される説明文要素。
 * ミューテッドカラーの小さめテキストで表示されます。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カード説明要素
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

/**
 * カードアクションコンポーネント
 *
 * カードヘッダーの右側に配置されるアクション要素。
 * ボタンやアイコンなどのインタラクティブな要素を配置します。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カードアクション要素
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />
  );
}

/**
 * カードコンテンツコンポーネント
 *
 * カードのメインコンテンツを表示するセクション。
 * カードの中央部分に配置されます。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カードコンテンツ要素
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

/**
 * カードフッターコンポーネント
 *
 * カードの下部に表示されるフッターセクション。
 * アクションボタンや追加情報を配置します。
 *
 * @param props - Divコンポーネントのプロパティ
 * @returns カードフッター要素
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
