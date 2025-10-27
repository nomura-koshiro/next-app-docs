import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';

/**
 * Inputコンポーネントのストーリー
 *
 * shadcn/uiベースの再利用可能なテキスト入力コンポーネント。
 * 様々な入力タイプ（テキスト、メール、パスワード、数値など）をサポートします。
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="user@example.com" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Input',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Input,

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
          '汎用的なテキスト入力コンポーネント。フォームでの使用を想定しています。\n\n' +
          '**主な機能:**\n' +
          '- 複数の入力タイプをサポート（text, email, password, number, tel, url）\n' +
          '- プレースホルダーテキストの設定\n' +
          '- 無効化状態の制御\n' +
          '- カスタムスタイルの適用が可能\n\n' +
          '**使用例:**\n' +
          '```tsx\n' +
          '<Input type="email" placeholder="user@example.com" />\n' +
          '```',
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
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: '入力フィールドのタイプ',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
        category: '入力設定',
      },
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
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
    defaultValue: {
      control: 'text',
      description: '初期値',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
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
    placeholder: 'テキストを入力してください',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのテキスト入力
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    placeholder: 'テキストを入力してください',
  },
  parameters: {
    docs: {
      description: {
        story: '最も基本的なテキスト入力フィールド。type属性を指定しない場合は自動的にtextタイプになります。',
      },
    },
  },
};

/**
 * メールアドレス入力
 */
export const Email: Story = {
  name: 'メール',
  args: {
    type: 'email',
    placeholder: 'user@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'メールアドレス専用の入力フィールド。ブラウザの自動バリデーションとキーボード最適化が有効になります。',
      },
    },
  },
};

/**
 * パスワード入力
 */
export const Password: Story = {
  name: 'パスワード',
  args: {
    type: 'password',
    placeholder: 'パスワードを入力',
  },
  parameters: {
    docs: {
      description: {
        story: 'パスワード入力用のフィールド。入力内容が自動的にマスキングされます。',
      },
    },
  },
};

/**
 * 数値入力
 */
export const Number: Story = {
  name: '数値',
  args: {
    type: 'number',
    placeholder: '0',
  },
  parameters: {
    docs: {
      description: {
        story: '数値専用の入力フィールド。増減ボタンが表示され、数値以外の入力が制限されます。',
      },
    },
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  name: '無効化',
  args: {
    placeholder: '無効化されています',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '無効化された状態の入力フィールド。ユーザーによる編集ができず、視覚的にもグレーアウト表示されます。',
      },
    },
  },
};

/**
 * 初期値あり
 */
export const WithDefaultValue: Story = {
  name: '初期値あり',
  args: {
    defaultValue: '入力済みの値',
  },
  parameters: {
    docs: {
      description: {
        story: '初期値が設定された入力フィールド。フォームの編集画面などで使用されます。',
      },
    },
  },
};

/**
 * ラベルとの組み合わせ
 */
export const WithLabel: Story = {
  name: 'ラベル付き',
  render: () => (
    <div className="space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        名前
      </label>
      <Input id="name" placeholder="山田太郎" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ラベルと組み合わせた実用的な使用例。アクセシビリティのためlabelとidを関連付けています。',
      },
    },
  },
};

/**
 * エラー表示
 */
export const WithError: Story = {
  name: 'エラー',
  render: () => (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        メールアドレス
      </label>
      <Input id="email" type="email" placeholder="user@example.com" aria-invalid="true" />
      <p className="text-sm text-red-500">有効なメールアドレスを入力してください</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラー時の表示例。aria-invalid属性とエラーメッセージを組み合わせています。',
      },
    },
  },
};
