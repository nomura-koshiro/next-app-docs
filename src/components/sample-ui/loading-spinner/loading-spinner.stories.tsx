import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LoadingSpinner } from './loading-spinner';

/**
 * LoadingSpinnerコンポーネントのストーリー
 *
 * ローディング状態を示すスピナーコンポーネント。
 * データ取得中やページ遷移時などの待機状態を視覚的に表現します。
 *
 * @example
 * ```tsx
 * <LoadingSpinner text="読み込み中..." size="md" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/LoadingSpinner',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: LoadingSpinner,

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
          'データ読み込み中や処理実行中の待機状態を表示するローディングスピナー。\n\n' +
          '**主な機能:**\n' +
          '- 3つのサイズバリエーション（small、medium、large）\n' +
          '- カスタマイズ可能なローディングテキスト\n' +
          '- フルスクリーン表示モード\n' +
          '- アニメーション効果\n\n' +
          '**使用場面:**\n' +
          '- ページ全体のローディング\n' +
          '- データ取得中の表示\n' +
          '- フォーム送信処理中\n' +
          '- コンテンツ領域のローディング',
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
    text: {
      control: 'text',
      description: 'ローディング中に表示するテキスト',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"読み込み中..."' },
        category: 'コンテンツ',
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'スピナーのサイズ（small、medium、large）',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
        category: 'スタイリング',
      },
    },
    fullScreen: {
      control: 'boolean',
      description: 'フルスクリーン表示モードの有効化',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'レイアウト',
      },
    },
  },

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    text: '読み込み中...',
    size: 'md',
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのLoadingSpinner
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {},
  parameters: {
    docs: {
      description: {
        story: '標準サイズのローディングスピナー。デフォルトのテキストとサイズで表示されます。',
      },
    },
  },
};

/**
 * カスタムテキスト
 */
export const CustomText: Story = {
  name: 'カスタムテキスト',
  args: {
    text: 'データを読み込んでいます...',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムテキストを表示したローディングスピナー。状況に応じたメッセージを設定できます。',
      },
    },
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  name: '小',
  args: {
    size: 'sm',
    text: '読み込み中...',
  },
  parameters: {
    docs: {
      description: {
        story: '小サイズのスピナー。ボタン内やコンパクトな領域での使用に適しています。',
      },
    },
  },
};

/**
 * 中サイズ
 */
export const Medium: Story = {
  name: '中',
  args: {
    size: 'md',
    text: '読み込み中...',
  },
  parameters: {
    docs: {
      description: {
        story: '中サイズのスピナー。最も汎用的なサイズで、カード内やモーダル内での使用に最適です。',
      },
    },
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  name: '大',
  args: {
    size: 'lg',
    text: '読み込み中...',
  },
  parameters: {
    docs: {
      description: {
        story: '大サイズのスピナー。ページ全体のローディングや重要な処理実行時に使用します。',
      },
    },
  },
};

/**
 * テキストなし
 */
export const NoText: Story = {
  name: 'テキストなし',
  args: {
    text: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'テキストを表示しないスピナー。スペースが限られている場合やミニマルなUIに適しています。',
      },
    },
  },
};

/**
 * フルスクリーン (Storybookでは表示が制限されます)
 */
export const FullScreen: Story = {
  name: 'フルスクリーン',
  args: {
    fullScreen: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'フルスクリーン表示モード。画面全体を覆うオーバーレイとして表示され、ページ全体のローディング状態を表現します。',
      },
    },
  },
};

/**
 * カード内での使用例
 */
export const InCard: Story = {
  name: 'カード内',
  render: () => (
    <div className="w-96 rounded-lg border bg-white p-8 shadow-sm">
      <LoadingSpinner text="データを取得中..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'カード内でのローディング表示例。コンテンツ領域内でデータ取得中であることを示します。',
      },
    },
  },
};
