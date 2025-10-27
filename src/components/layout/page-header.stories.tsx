import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/sample-ui/button';

import { PageHeader } from './page-header';

/**
 * PageHeaderコンポーネントのストーリー
 *
 * ページの上部に表示されるヘッダーコンポーネント。
 * タイトル、説明文、アクションボタンを表示します。
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="ユーザー管理"
 *   description="システムに登録されているユーザーの一覧と管理"
 *   action={<Button>新規作成</Button>}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/layout/PageHeader',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: PageHeader,

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
          'ページの上部に配置するヘッダーコンポーネント。ページのタイトルと説明を表示し、必要に応じてアクションボタンを配置できます。\n\n' +
          '**主な機能:**\n' +
          '- ページタイトルの表示\n' +
          '- 説明文の表示\n' +
          '- アクションボタンの配置\n' +
          '- レスポンシブ対応\n\n' +
          '**使用場面:**\n' +
          '- 管理画面のページヘッダー\n' +
          '- 一覧ページのヘッダー\n' +
          '- 詳細ページのヘッダー\n' +
          '- 設定ページのヘッダー',
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
    title: {
      control: 'text',
      description: 'ページタイトル',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
      },
    },
    description: {
      control: 'text',
      description: 'ページの説明文',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
      },
    },
    action: {
      control: false,
      description: 'アクションボタン（ReactNode）',
      table: {
        type: { summary: 'ReactNode' },
        category: 'コンテンツ',
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * タイトルのみ
 */
export const TitleOnly: Story = {
  name: 'タイトルのみ',
  args: {
    title: 'ページタイトル',
  },
  parameters: {
    docs: {
      description: {
        story: '最もシンプルなページヘッダー。タイトルのみを表示します。',
      },
    },
  },
};

/**
 * タイトルと説明文
 */
export const WithDescription: Story = {
  name: '説明文付き',
  args: {
    title: 'ユーザー管理',
    description: 'システムに登録されているユーザーの一覧と管理',
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルと説明文を組み合わせた構成。ページの目的をより明確に伝えることができます。',
      },
    },
  },
};

/**
 * アクションボタン付き
 */
export const WithAction: Story = {
  name: 'アクション付き',
  args: {
    title: 'ユーザー一覧',
    description: '登録されているユーザーの一覧',
    action: <Button>新規ユーザー作成</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'アクションボタンを配置したページヘッダー。新規作成などの主要なアクションを配置するのに適しています。',
      },
    },
  },
};

/**
 * 複数のアクションボタン
 */
export const MultipleActions: Story = {
  name: '複数アクション',
  args: {
    title: '設定',
    description: 'アプリケーションの設定を管理',
  },
  render: () => (
    <PageHeader
      title="設定"
      description="アプリケーションの設定を管理"
      action={
        <div className="flex gap-2">
          <Button variant="outline">キャンセル</Button>
          <Button>保存</Button>
        </div>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '複数のアクションボタンを配置した例。編集フォームなどで保存とキャンセルのボタンを並べる場合に使用します。',
      },
    },
  },
};

/**
 * 長いタイトルと説明文の表示確認
 */
export const LongText: Story = {
  name: '長文テキスト',
  args: {
    title: '非常に長いページタイトルの例を示しています',
    description: 'これは非常に長い説明文の例です。複数行にわたる説明文がどのように表示されるかを確認するためのサンプルテキストです。',
  },
  parameters: {
    docs: {
      description: {
        story: '長いタイトルと説明文の表示例。テキストの折り返しやレイアウトの確認に使用します。',
      },
    },
  },
};
