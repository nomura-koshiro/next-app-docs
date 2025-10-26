import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * インプットコンポーネント
 *
 * shadcn/uiベースのテキスト入力フィールド。
 * フォームで使用される標準的な入力コンポーネントです。
 *
 * 機能:
 * - フォーカス時のリングスタイル
 * - バリデーションエラー時のスタイル（aria-invalid対応）
 * - ファイル選択入力のサポート
 * - ダークモード対応
 * - 無効化状態のスタイル
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="名前を入力" />
 * <Input type="email" aria-invalid={true} />
 * <Input type="file" />
 * ```
 *
 * @param props - HTMLInputElementのプロパティ
 * @returns インプット要素
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // ベーススタイル
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // フォーカススタイル
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        // バリデーションエラースタイル
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
