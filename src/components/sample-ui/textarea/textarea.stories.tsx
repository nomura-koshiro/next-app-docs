import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { Label } from '@/components/sample-ui/label';

import { Textarea } from './textarea';

/**
 * Textareaコンポーネントのストーリー
 *
 * shadcn/uiベースの複数行テキスト入力コンポーネント。
 * 長文やコメント、説明文などの入力に使用します。
 *
 * @example
 * ```tsx
 * <Textarea placeholder="メッセージを入力してください..." rows={5} />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Textarea',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Textarea,

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
          '複数行のテキストを入力するためのテキストエリアコンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- 複数行のテキスト入力\n' +
          '- 行数の指定\n' +
          '- プレースホルダーテキストの設定\n' +
          '- 無効化状態の制御\n' +
          '- リサイズの制御\n' +
          '- 文字数制限の設定\n\n' +
          '**使用場面:**\n' +
          '- コメントや感想の入力\n' +
          '- 長文の説明や詳細情報の入力\n' +
          '- フィードバックフォーム\n' +
          '- メッセージ作成',
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
    rows: {
      control: 'number',
      description: '表示する行数',
      table: {
        type: { summary: 'number' },
        category: 'レイアウト',
      },
    },
    maxLength: {
      control: 'number',
      description: '最大文字数',
      table: {
        type: { summary: 'number' },
        category: 'バリデーション',
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのTextarea
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="message">メッセージ</Label>
      <Textarea id="message" placeholder="メッセージを入力してください..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的な複数行テキスト入力エリア。ラベルと組み合わせて使用します。',
      },
    },
  },
};

/**
 * 値が設定された状態
 */
export const WithValue: Story = {
  name: '値あり',
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="bio">自己紹介</Label>
      <Textarea
        id="bio"
        defaultValue="こんにちは！フロントエンドエンジニアとして働いています。React、TypeScript、Next.jsを使った開発が得意です。"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '初期値が設定されたテキストエリア。プロフィール編集画面などで使用されます。',
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
    <div className="w-[400px] space-y-2">
      <Label htmlFor="disabled">無効化されたテキストエリア</Label>
      <Textarea id="disabled" placeholder="入力できません..." disabled defaultValue="このテキストエリアは無効化されています" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '無効化された状態のテキストエリア。ユーザーによる編集ができず、視覚的にもグレーアウト表示されます。',
      },
    },
  },
};

/**
 * 行数を指定した状態
 */
export const WithRows: Story = {
  name: '行数指定',
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="rows">大きなテキストエリア（10行）</Label>
      <Textarea id="rows" rows={10} placeholder="長文を入力するための大きなテキストエリアです..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '行数を指定したテキストエリア。長文の入力が必要な場合に、より広い入力スペースを提供します。',
      },
    },
  },
};

/**
 * 文字数カウント付き
 */
export const WithCharacterCount: Story = {
  name: '文字数カウント付き',
  render: () => {
    const maxLength = 200;
    const [value, setValue] = React.useState('');

    return (
      <div className="w-[400px] space-y-2">
        <Label htmlFor="with-count">コメント</Label>
        <Textarea
          id="with-count"
          placeholder="コメントを入力してください..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} 文字
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '文字数カウンターを組み合わせた例。ユーザーに残りの入力可能文字数を明示的に表示します。',
      },
    },
  },
};

/**
 * エラー状態
 */
export const WithError: Story = {
  name: 'エラー',
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="error" className="text-destructive">
        コメント <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id="error"
        placeholder="10文字以上で入力してください..."
        defaultValue="短い"
        className="border-destructive"
        aria-invalid="true"
      />
      <p className="text-sm text-destructive">コメントは10文字以上で入力してください</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラー時の表示例。エラー状態を視覚的に示し、エラーメッセージを表示します。',
      },
    },
  },
};

/**
 * フィードバックフォームの例
 */
export const FeedbackForm: Story = {
  name: 'フィードバックフォーム',
  render: () => (
    <div className="w-[500px] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedback">
          フィードバック <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea id="feedback" placeholder="サービスに関するご意見やご要望をお聞かせください..." rows={6} />
        <p className="text-sm text-muted-foreground">具体的なご意見をいただけると改善に役立ちます</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '実用的なフィードバックフォームの例。必須マークとヘルプテキストを組み合わせた構成です。',
      },
    },
  },
};
