import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * チェックボックスコンポーネント
 *
 * Radix UIのCheckboxプリミティブをベースにしたチェックボックス。
 * アクセシブルなチェックボックスUIを提供します。
 *
 * 機能:
 * - Radix UIによるアクセシビリティサポート
 * - チェック状態の視覚的フィードバック
 * - フォーカス時のリングスタイル
 * - 無効化状態のスタイル
 *
 * @example
 * ```tsx
 * <Checkbox id="terms" />
 * <Label htmlFor="terms">利用規約に同意する</Label>
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
