import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/sample-ui/button';

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

/**
 * Cardコンポーネントのストーリー
 *
 * コンテンツをグループ化して表示するためのカードコンポーネント。
 * ヘッダー、コンテンツ、フッター、アクションなどのセクションで構成されます。
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>タイトル</CardTitle>
 *     <CardDescription>説明文</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     コンテンツ
 *   </CardContent>
 * </Card>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Card',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Card,

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
          'コンテンツをグループ化して表示するためのカードコンポーネント。\n\n' +
          '**構成要素:**\n' +
          '- `Card`: カードのコンテナ\n' +
          '- `CardHeader`: ヘッダーセクション\n' +
          '- `CardTitle`: タイトル\n' +
          '- `CardDescription`: 説明文\n' +
          '- `CardContent`: メインコンテンツ\n' +
          '- `CardFooter`: フッターセクション（ボタンなど）\n' +
          '- `CardAction`: ヘッダー内のアクションボタン\n\n' +
          '**使用場面:**\n' +
          '- ダッシュボードのウィジェット\n' +
          '- フォームのグループ化\n' +
          '- リスト項目の詳細表示\n' +
          '- 設定パネル',
      },
    },

    // ================================================================================
    // 背景色のテストオプション
    // 異なる背景色でコンポーネントの見た目を確認できます
    // ================================================================================
    backgrounds: {
      default: 'gray',
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
    className: {
      control: 'text',
      description: '追加のCSSクラス名',
      table: {
        type: { summary: 'string' },
        category: 'スタイリング',
      },
    },
    children: {
      control: false,
      description: 'カードの内容（CardHeader、CardContent、CardFooterなど）',
      table: {
        type: { summary: 'ReactNode' },
        category: 'コンテンツ',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なカード
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文がここに入ります。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なカード構成。ヘッダー（タイトルと説明）とコンテンツで構成されています。',
      },
    },
  },
};

/**
 * フッター付きカード
 */
export const WithFooter: Story = {
  name: 'フッター付き',
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>フッター付きカード</CardTitle>
        <CardDescription>フッターにアクションボタンを配置できます。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          キャンセル
        </Button>
        <Button className="w-full ml-2">保存</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'フッターセクションを持つカード。アクションボタン（保存、キャンセルなど）を配置するのに適しています。',
      },
    },
  },
};

/**
 * アクション付きカード
 */
export const WithAction: Story = {
  name: 'アクション付き',
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>アクション付きカード</CardTitle>
        <CardDescription>ヘッダーにアクションボタンを配置</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            編集
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * シンプルなカード
 */
export const Simple: Story = {
  name: 'シンプル',
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p>ヘッダーなしのシンプルなカードです。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * フォーム用カード
 */
export const FormCard: Story = {
  name: 'フォーム',
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>アカウントにログインしてください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">メールアドレス</label>
            <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="user@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">パスワード</label>
            <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="パスワード" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">ログイン</Button>
      </CardFooter>
    </Card>
  ),
};
