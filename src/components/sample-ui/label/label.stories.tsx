import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@/components/sample-ui/input';

import { Label } from './label';

/**
 * Labelコンポーネントのストーリー
 *
 * フォーム要素のラベルを表示するためのコンポーネント。
 * アクセシビリティのため、入力フィールドと関連付けて使用します。
 *
 * @example
 * ```tsx
 * <Label htmlFor="name">名前</Label>
 * <Input id="name" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Label',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Label,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'padded',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          'フォーム要素のラベルコンポーネント。Radix UI Labelをベースに構築されています。\n\n' +
          '**主な機能:**\n' +
          '- 入力フィールドとの関連付け（htmlFor属性）\n' +
          '- アクセシビリティサポート\n' +
          '- 必須マークの表示\n' +
          '- 無効化状態のサポート\n\n' +
          '**使用場面:**\n' +
          '- すべてのフォーム入力フィールド\n' +
          '- チェックボックス\n' +
          '- ラジオボタン',
      },
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
    children: {
      control: 'text',
      description: 'ラベルのテキスト内容',
      table: {
        type: { summary: 'ReactNode' },
        category: 'コンテンツ',
      },
    },
    htmlFor: {
      control: 'text',
      description: '関連付ける入力フィールドのid',
      table: {
        type: { summary: 'string' },
        category: 'アクセシビリティ',
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

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    children: 'ラベル',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのLabel
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    children: 'ラベル',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的なラベル表示。単独で使用されることは少なく、通常は入力フィールドと組み合わせます。',
      },
    },
  },
};

/**
 * Input付きLabel
 */
export const WithInput: Story = {
  name: '入力フィールド付き',
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">名前</Label>
      <Input id="name" placeholder="山田太郎" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '入力フィールドと組み合わせた実用的な使用例。htmlForとidを関連付けることでアクセシビリティが向上します。',
      },
    },
  },
};

/**
 * 必須マーク付きLabel
 */
export const Required: Story = {
  name: '必須',
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">
        メールアドレス
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input id="email" type="email" placeholder="user@example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '必須フィールドであることを示すアスタリスク（*）付きのラベル。赤色で視覚的に強調します。',
      },
    },
  },
};

/**
 * 無効化されたLabel
 */
export const Disabled: Story = {
  name: '無効',
  render: () => (
    <div className="space-y-2" data-disabled="true">
      <Label htmlFor="disabled">無効化されたフィールド</Label>
      <Input id="disabled" disabled placeholder="入力できません" />
    </div>
  ),
};
