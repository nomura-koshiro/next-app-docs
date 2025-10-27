import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

/**
 * Alertコンポーネントのストーリー
 *
 * 重要な情報やメッセージをユーザーに伝えるためのアラートコンポーネント。
 * タイトル、説明文、アイコンを組み合わせて使用します。
 *
 * @example
 * ```tsx
 * <Alert>
 *   <Info className="h-4 w-4" />
 *   <AlertTitle>情報</AlertTitle>
 *   <AlertDescription>メッセージ内容</AlertDescription>
 * </Alert>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Alert',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Alert,

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
          'ユーザーに重要な情報を伝えるためのアラートコンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- 2種類のバリエーション（default, destructive）\n' +
          '- タイトルと説明文の表示\n' +
          '- アイコンの表示サポート\n' +
          '- カスタムスタイルの適用が可能\n\n' +
          '**使用場面:**\n' +
          '- 情報メッセージの表示\n' +
          '- エラーメッセージの表示\n' +
          '- 成功メッセージの表示\n' +
          '- 警告メッセージの表示',
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
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'アラートのバリエーション',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: '外観',
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
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのアラート
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>情報</AlertTitle>
      <AlertDescription>これはデフォルトのアラートメッセージです。</AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '一般的な情報メッセージを表示する際に使用します。アイコン、タイトル、説明文の組み合わせ。',
      },
    },
  },
};

/**
 * 破壊的なアクション用のアラート
 */
export const Destructive: Story = {
  name: '破壊的',
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>エラー</AlertTitle>
      <AlertDescription>エラーが発生しました。もう一度お試しください。</AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'エラーや警告など、ユーザーの注意を引く必要がある重要なメッセージに使用します。赤色で強調表示されます。',
      },
    },
  },
};

/**
 * 成功メッセージ
 */
export const Success: Story = {
  name: '成功',
  render: () => (
    <Alert>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>成功</AlertTitle>
      <AlertDescription>操作が正常に完了しました。</AlertDescription>
    </Alert>
  ),
};

/**
 * タイトルのみのアラート
 */
export const TitleOnly: Story = {
  name: 'タイトルのみ',
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>タイトルのみのアラート</AlertTitle>
    </Alert>
  ),
};

/**
 * 説明文のみのアラート
 */
export const DescriptionOnly: Story = {
  name: '説明文のみ',
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>説明文のみのアラート</AlertDescription>
    </Alert>
  ),
};

/**
 * アイコンなしのアラート
 */
export const WithoutIcon: Story = {
  name: 'アイコンなし',
  render: () => (
    <Alert>
      <AlertTitle>アイコンなし</AlertTitle>
      <AlertDescription>アイコンを使用しないアラートです。</AlertDescription>
    </Alert>
  ),
};
