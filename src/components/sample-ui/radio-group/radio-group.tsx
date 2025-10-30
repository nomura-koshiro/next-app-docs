import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * ラジオグループコンポーネント
 *
 * Radix UIのRadioGroupプリミティブをベースにした排他選択グループ。
 * 複数の選択肢から1つを選択するためのアクセシブルなUIコンポーネントです。
 *
 * 機能:
 * - Radix UIによるアクセシビリティサポート
 * - キーボードナビゲーション対応
 * - グリッドレイアウト
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option1" id="r1" />
 *     <Label htmlFor="r1">オプション1</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option2" id="r2" />
 *     <Label htmlFor="r2">オプション2</Label>
 *   </div>
 * </RadioGroup>
 * ```
 *
 * @param props - Radix UI RadioGroupRootコンポーネントのプロパティ
 * @returns ラジオグループ要素
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * ラジオグループアイテムコンポーネント
 *
 * ラジオグループ内の個別の選択肢。
 * 選択時に中央の円が表示されます。
 *
 * 機能:
 * - 円形のラジオボタンデザイン
 * - フォーカス時のリングスタイル
 * - 選択状態の視覚的フィードバック
 * - 無効化状態のスタイル
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="option1" id="option1" />
 * <Label htmlFor="option1">オプション1</Label>
 * ```
 *
 * @param props - Radix UI RadioGroupItemコンポーネントのプロパティ
 * @returns ラジオグループアイテム要素
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
