import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * clsxとtailwind-mergeを組み合わせて、条件付きクラス名と
 * Tailwindのクラス名の競合を解決します。
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-2が上書きされる)
 * cn('text-red-500', condition && 'text-blue-500') // 条件付きクラス
 * ```
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
