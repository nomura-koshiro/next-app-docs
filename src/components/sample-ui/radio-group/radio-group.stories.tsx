import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from '@/components/sample-ui/label';

import { RadioGroup, RadioGroupItem } from './radio-group';

/**
 * RadioGroupコンポーネントのストーリー
 *
 * 複数の選択肢から一つを選択するラジオボタングループコンポーネント。
 * 排他的な選択が必要な場面で使用します。
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option-1">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option-1" id="option-1" />
 *     <Label htmlFor="option-1">オプション 1</Label>
 *   </div>
 * </RadioGroup>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/RadioGroup',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: RadioGroup,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'centered',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          '排他的な選択を行うラジオボタングループコンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- 複数の選択肢から一つを選択\n' +
          '- デフォルト値の設定\n' +
          '- 無効化状態の制御\n' +
          '- ラベルとの連携\n' +
          '- 説明文の追加が可能\n\n' +
          '**使用場面:**\n' +
          '- フォームでの排他的選択\n' +
          '- 設定画面での選択\n' +
          '- アンケートフォーム\n' +
          '- 支払い方法の選択',
      },
    },

    // ================================================================================
    // 背景色のテストオプション
    // 異なる背景色でコンポーネントの見た目を確認できます
    // ================================================================================
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],

  // ================================================================================
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    defaultValue: {
      control: 'text',
      description: '初期選択値',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
      },
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    onValueChange: {
      description: '選択値変更時のコールバック関数',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'イベント',
      },
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス名',
      table: {
        type: { summary: 'string' },
        category: 'スタイリング',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのRadioGroup
 */
export const Default: Story = {
  name: 'デフォルト',
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
  parameters: {
    docs: {
      description: {
        story: '基本的なラジオボタングループ。複数の選択肢から一つを選択できます。',
      },
    },
  },
};

/**
 * 説明文付き
 */
export const WithDescription: Story = {
  name: '説明文付き',
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r1" className="cursor-pointer font-normal">
            デフォルト
          </Label>
          <p className="text-sm text-muted-foreground">標準的な表示サイズです</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r2" className="cursor-pointer font-normal">
            快適
          </Label>
          <p className="text-sm text-muted-foreground">少し余裕のある表示サイズです</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="r3" className="cursor-pointer font-normal">
            コンパクト
          </Label>
          <p className="text-sm text-muted-foreground">密度の高い表示サイズです</p>
        </div>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: '各選択肢に説明文を追加した例。ユーザーが選択肢の内容を理解しやすくなります。',
      },
    },
  },
};

/**
 * 性別選択の例
 */
export const Gender: Story = {
  name: '性別',
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
          <p className="text-sm text-muted-foreground">回答したくない、または別の性別</p>
        </div>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: '性別選択フォームの実用例。一部の選択肢のみに説明文を付けることも可能です。',
      },
    },
  },
};

/**
 * 支払い方法選択の例
 */
export const PaymentMethod: Story = {
  name: '支払い方法',
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="card" id="card" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="card" className="cursor-pointer font-normal">
            クレジットカード
          </Label>
          <p className="text-sm text-muted-foreground">Visa、Mastercard、JCBなどに対応</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="bank" id="bank" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="bank" className="cursor-pointer font-normal">
            銀行振込
          </Label>
          <p className="text-sm text-muted-foreground">振込手数料はお客様負担となります</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="convenience" id="convenience" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="convenience" className="cursor-pointer font-normal">
            コンビニ決済
          </Label>
          <p className="text-sm text-muted-foreground">全国の主要コンビニで支払い可能</p>
        </div>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ECサイトなどでの支払い方法選択の例。すべての選択肢に詳細な説明を付けています。',
      },
    },
  },
};

/**
 * 無効化された状態
 */
export const Disabled: Story = {
  name: '無効',
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
  parameters: {
    docs: {
      description: {
        story: '無効化されたラジオボタングループ。ユーザーによる選択ができず、視覚的にもグレーアウト表示されます。',
      },
    },
  },
};
