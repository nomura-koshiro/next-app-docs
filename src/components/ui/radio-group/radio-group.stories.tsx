import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "@/components/ui/label";

const meta = {
  title: "components/ui/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1" className="cursor-pointer font-normal">
          オプション 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2" className="cursor-pointer font-normal">
          オプション 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3" className="cursor-pointer font-normal">
          オプション 3
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r1" className="cursor-pointer font-normal">
            デフォルト
          </Label>
          <p className="text-sm text-muted-foreground">
            標準的な表示サイズです
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2" className="cursor-pointer font-normal">
            快適
          </Label>
          <p className="text-sm text-muted-foreground">
            少し余裕のある表示サイズです
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r3" className="cursor-pointer font-normal">
            コンパクト
          </Label>
          <p className="text-sm text-muted-foreground">
            密度の高い表示サイズです
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Gender: Story = {
  render: () => (
    <RadioGroup defaultValue="male">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="male" id="male" />
        <Label htmlFor="male" className="cursor-pointer font-normal">
          男性
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="female" id="female" />
        <Label htmlFor="female" className="cursor-pointer font-normal">
          女性
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="other" id="other" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="other" className="cursor-pointer font-normal">
            その他
          </Label>
          <p className="text-sm text-muted-foreground">
            回答したくない、または別の性別
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const PaymentMethod: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="card" id="card" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="card" className="cursor-pointer font-normal">
            クレジットカード
          </Label>
          <p className="text-sm text-muted-foreground">
            Visa、Mastercard、JCBなどに対応
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="bank" id="bank" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="bank" className="cursor-pointer font-normal">
            銀行振込
          </Label>
          <p className="text-sm text-muted-foreground">
            振込手数料はお客様負担となります
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="convenience" id="convenience" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="convenience" className="cursor-pointer font-normal">
            コンビニ決済
          </Label>
          <p className="text-sm text-muted-foreground">
            全国の主要コンビニで支払い可能
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="disabled-1" />
        <Label htmlFor="disabled-1" className="cursor-pointer font-normal">
          選択済み（無効）
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="disabled-2" />
        <Label htmlFor="disabled-2" className="cursor-pointer font-normal">
          未選択（無効）
        </Label>
      </div>
    </RadioGroup>
  ),
};
