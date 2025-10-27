import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { ChatInput } from './chat-input';

/**
 * ChatInputコンポーネントのストーリー
 *
 * チャット入力フォームコンポーネント。メッセージの入力と送信を管理します。
 * Enterキーでの送信とShift+Enterでの改行をサポートします。
 *
 * @example
 * ```tsx
 * <ChatInput
 *   value={inputMessage}
 *   onChange={handleInputChange}
 *   onSubmit={handleSendMessage}
 *   isSending={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-chat/routes/sample-chat/components/ChatInput',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ChatInput,

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
          'チャットメッセージの入力と送信を管理するコンポーネント。Enterキーでの送信とShift+Enterでの改行をサポートします。\n\n' +
          '**主な機能:**\n' +
          '- テキストエリアによるメッセージ入力\n' +
          '- Enterキーでの送信（Shift+Enterで改行）\n' +
          '- 送信中のローディング状態表示\n' +
          '- 空メッセージの送信を防止\n\n' +
          '**使用場面:**\n' +
          '- チャットアプリケーション\n' +
          '- メッセージング機能',
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
    value: {
      control: 'text',
      description: '入力中のメッセージ',
      table: {
        type: { summary: 'string' },
        category: '状態',
      },
    },
    onChange: {
      description: '入力変更ハンドラー',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'イベント',
      },
    },
    onSubmit: {
      description: '送信ハンドラー',
      table: {
        type: { summary: '() => void' },
        category: 'イベント',
      },
    },
    isSending: {
      control: 'boolean',
      description: '送信中かどうか',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    disabled: {
      control: 'boolean',
      description: '無効化フラグ',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
  },

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    value: '',
    onChange: fn(),
    onSubmit: fn(),
    isSending: false,
    disabled: false,
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * チャット入力フォームの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <ChatInput
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
        onSubmit={() => {
          args.onSubmit();
          setValue('');
        }}
        isSending={false}
        disabled={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'チャット入力フォームの初期状態。テキストエリアにメッセージを入力できます。',
      },
    },
  },
};

/**
 * 入力中状態
 * メッセージが入力されている状態
 */
export const WithMessage: Story = {
  name: '入力中',
  render: (args) => {
    const [value, setValue] = useState('こんにちは！今日はいい天気ですね。');

    return (
      <ChatInput
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
        onSubmit={() => {
          args.onSubmit();
          setValue('');
        }}
        isSending={false}
        disabled={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'メッセージが入力されている状態。送信ボタンが有効になっています。',
      },
    },
  },
};

/**
 * 送信中状態
 * メッセージを送信中の状態
 */
export const Sending: Story = {
  name: '送信中',
  args: {
    value: 'メッセージを送信しました',
    isSending: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'メッセージ送信中の状態。送信ボタンがローディング表示になり、入力が無効化されます。',
      },
    },
  },
};

/**
 * 無効化状態
 * 入力フォームが無効化されている状態
 */
export const Disabled: Story = {
  name: '無効化',
  args: {
    value: '',
    disabled: true,
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: '入力フォームが無効化された状態。ユーザーは入力も送信もできません。',
      },
    },
  },
};

/**
 * 複数行メッセージ
 * 改行を含む長いメッセージ
 */
export const MultilineMessage: Story = {
  name: '複数行メッセージ',
  render: (args) => {
    const [value, setValue] = useState('こんにちは！\n\n今日はいい天気ですね。\n散歩に行きませんか？');

    return (
      <ChatInput
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
        onSubmit={() => {
          args.onSubmit();
          setValue('');
        }}
        isSending={false}
        disabled={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '改行を含む複数行のメッセージ。Shift+Enterで改行を入力できます。',
      },
    },
  },
};
