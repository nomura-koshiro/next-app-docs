'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * ラベルコンポーネント
 *
 * Radix UIのLabelプリミティブをベースにしたフォームラベル。
 * フォームフィールドに関連付けられるアクセシブルなラベルコンポーネントです。
 *
 * 機能:
 * - Radix UIによるアクセシビリティサポート
 * - 無効化状態のスタイル対応
 * - ピア要素の無効化状態に応じたスタイル
 * - 選択不可テキスト
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">メールアドレス</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * @param props - Radix UI LabelRootコンポーネントのプロパティ
 * @returns ラベル要素
 */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
