import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { type SampleItem, SAMPLES } from '@/features/sample-page-list/constants/samples';

import { SampleListContent } from './sample-list-content';

/**
 * SampleListContentコンポーネントのストーリー
 *
 * サンプル一覧のコンテンツ表示コンポーネント。
 * カテゴリ別にグループ化されたサンプルページへのリンクカードを表示します。
 *
 * @example
 * ```tsx
 * <SampleListContent samples={SAMPLES} />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-page-list/routes/sample-page-list/components/SampleListContent',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: SampleListContent,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'padded',

    // ================================================================================
    // Next.js設定
    // ================================================================================
    nextjs: {
      appDirectory: true,
    },

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          'サンプル一覧のコンテンツ表示コンポーネント。カテゴリ別にグループ化されたサンプルページへのリンクカードを表示します。\n\n' +
          '**主な機能:**\n' +
          '- カテゴリ別にサンプルをグループ化\n' +
          '- グリッドレイアウトでカードを表示\n' +
          '- ホバーエフェクト付きのインタラクティブなカード\n' +
          '- サンプル利用のヒント表示\n\n' +
          '**使用場面:**\n' +
          '- サンプルページ一覧の表示\n' +
          '- プロジェクトの実装例集の表示',
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof SampleListContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 全サンプルを表示
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    samples: SAMPLES,
  },
  parameters: {
    docs: {
      description: {
        story: 'すべてのサンプルページをカテゴリ別に表示します。フォーム、認証、ユーザー管理などのカテゴリに分類されています。',
      },
    },
  },
};

/**
 * 単一カテゴリ
 * 1つのカテゴリのみを表示
 */
export const SingleCategory: Story = {
  name: '単一カテゴリ',
  args: {
    samples: SAMPLES.filter((sample) => sample.category === 'ユーザー管理'),
  },
  parameters: {
    docs: {
      description: {
        story: '特定のカテゴリ（ユーザー管理）のサンプルのみを表示します。フィルタリング機能の実装例として活用できます。',
      },
    },
  },
};

/**
 * 少数のアイテム
 * 2つのサンプルのみを表示
 */
export const FewItems: Story = {
  name: '少数のアイテム',
  args: {
    samples: SAMPLES.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: '少数のサンプルのみを表示する場合のレイアウト例。',
      },
    },
  },
};

/**
 * カスタムサンプル
 * カスタムデータを使用した表示
 */
export const CustomSamples: Story = {
  name: 'カスタムサンプル',
  args: {
    samples: [
      {
        title: 'カスタム機能 A',
        description: 'カスタム機能Aの説明。この機能は独自の実装例を提供します。',
        href: '/custom-a',
        category: 'カスタム',
      },
      {
        title: 'カスタム機能 B',
        description: 'カスタム機能Bの説明。この機能も独自の実装例を提供します。',
        href: '/custom-b',
        category: 'カスタム',
      },
      {
        title: 'カスタム機能 C',
        description: 'カスタム機能Cの説明。さらなる実装例を確認できます。',
        href: '/custom-c',
        category: 'カスタム',
      },
    ] as SampleItem[],
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムデータを使用した表示例。独自のサンプルページ一覧を作成する際の参考になります。',
      },
    },
  },
};

/**
 * 空の状態
 * サンプルが1つもない場合
 */
export const Empty: Story = {
  name: '空の状態',
  args: {
    samples: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'サンプルが1つもない場合の表示。空の状態のハンドリングを確認できます。',
      },
    },
  },
};
