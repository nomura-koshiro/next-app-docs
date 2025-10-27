import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { Message } from '../../../types';
import { ChatMessage } from './chat-message';

/**
 * ChatMessageコンポーネントのストーリー
 *
 * チャットメッセージバブルコンポーネント。ユーザーとアシスタントのメッセージを
 * 適切なスタイルで表示します。
 *
 * @example
 * ```tsx
 * <ChatMessage message={message} />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-chat/routes/sample-chat/components/ChatMessage',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ChatMessage,

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
          'チャットメッセージを表示するコンポーネント。ユーザーとアシスタントのメッセージを適切なスタイルで表示します。\n\n' +
          '**主な機能:**\n' +
          '- ユーザーとアシスタントの区別（アイコンと配置で判別）\n' +
          '- タイムスタンプの表示\n' +
          '- 長いメッセージの折り返し\n' +
          '- 改行のサポート\n\n' +
          '**使用場面:**\n' +
          '- チャットアプリケーション\n' +
          '- メッセージング機能\n' +
          '- カスタマーサポートチャット',
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
    message: {
      description: 'メッセージデータ',
      table: {
        type: { summary: 'Message' },
        category: 'データ',
      },
    },
  },
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ユーザーメッセージ
 * ユーザーが送信したメッセージ
 */
export const UserMessage: Story = {
  name: 'ユーザーメッセージ',
  args: {
    message: {
      id: '1',
      role: 'user',
      content: 'こんにちは！今日はいい天気ですね。',
      timestamp: new Date('2025-01-15T10:30:00'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザーが送信したメッセージ。右側に青いバブルで表示されます。',
      },
    },
  },
};

/**
 * アシスタントメッセージ
 * アシスタントからの返信メッセージ
 */
export const AssistantMessage: Story = {
  name: 'アシスタントメッセージ',
  args: {
    message: {
      id: '2',
      role: 'assistant',
      content: 'こんにちは！はい、とても良い天気ですね。お出かけ日和ですよ。',
      timestamp: new Date('2025-01-15T10:30:05'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: 'アシスタントからの返信メッセージ。左側にグレーのバブルで表示されます。',
      },
    },
  },
};

/**
 * 長いメッセージ（ユーザー）
 * 折り返しが発生する長いメッセージ
 */
export const LongUserMessage: Story = {
  name: '長いユーザーメッセージ',
  args: {
    message: {
      id: '3',
      role: 'user',
      content:
        'こんにちは！今日はとてもいい天気ですね。こんな日は外に出かけたくなります。公園に散歩に行ったり、カフェでゆっくりコーヒーを飲んだりするのもいいですね。あなたはどう思いますか？',
      timestamp: new Date('2025-01-15T10:35:00'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '長いユーザーメッセージ。テキストが自動的に折り返されて表示されます。',
      },
    },
  },
};

/**
 * 長いメッセージ（アシスタント）
 * 折り返しが発生する長いアシスタントメッセージ
 */
export const LongAssistantMessage: Story = {
  name: '長いアシスタントメッセージ',
  args: {
    message: {
      id: '4',
      role: 'assistant',
      content:
        'そうですね！素晴らしい提案だと思います。天気の良い日は外で過ごすことで気分もリフレッシュできますし、健康にも良い影響があります。公園での散歩は自然を感じられて心地よいですし、カフェでゆっくり過ごすのも素敵な時間の使い方だと思います。ぜひ楽しんでくださいね。',
      timestamp: new Date('2025-01-15T10:35:05'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '長いアシスタントメッセージ。テキストが自動的に折り返されて表示されます。',
      },
    },
  },
};

/**
 * 複数行メッセージ（ユーザー）
 * 改行を含むユーザーメッセージ
 */
export const MultilineUserMessage: Story = {
  name: '複数行ユーザーメッセージ',
  args: {
    message: {
      id: '5',
      role: 'user',
      content: 'こんにちは！\n\n今日の予定について教えてください。\n\n1. 午前中の予定\n2. 午後の予定\n3. その他',
      timestamp: new Date('2025-01-15T11:00:00'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '改行を含むユーザーメッセージ。リスト形式など構造化されたテキストを表示できます。',
      },
    },
  },
};

/**
 * 複数行メッセージ（アシスタント）
 * 改行を含むアシスタントメッセージ
 */
export const MultilineAssistantMessage: Story = {
  name: '複数行アシスタントメッセージ',
  args: {
    message: {
      id: '6',
      role: 'assistant',
      content: '今日の予定についてお答えします。\n\n【午前中】\n・チーム会議 10:00-11:00\n・資料作成 11:00-12:00\n\n【午後】\n・プレゼンテーション準備 13:00-15:00\n・クライアントミーティング 15:00-16:00',
      timestamp: new Date('2025-01-15T11:00:05'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '改行を含むアシスタントメッセージ。構造化された情報を見やすく表示できます。',
      },
    },
  },
};

/**
 * 短いメッセージ（ユーザー）
 * 一言のみのメッセージ
 */
export const ShortUserMessage: Story = {
  name: '短いユーザーメッセージ',
  args: {
    message: {
      id: '7',
      role: 'user',
      content: 'ありがとう！',
      timestamp: new Date('2025-01-15T11:30:00'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '短いユーザーメッセージ。一言だけのシンプルなメッセージも適切に表示されます。',
      },
    },
  },
};

/**
 * 短いメッセージ（アシスタント）
 * 一言のみのメッセージ
 */
export const ShortAssistantMessage: Story = {
  name: '短いアシスタントメッセージ',
  args: {
    message: {
      id: '8',
      role: 'assistant',
      content: 'どういたしまして！',
      timestamp: new Date('2025-01-15T11:30:05'),
    } as Message,
  },
  parameters: {
    docs: {
      description: {
        story: '短いアシスタントメッセージ。簡潔な返信も見やすく表示されます。',
      },
    },
  },
};
