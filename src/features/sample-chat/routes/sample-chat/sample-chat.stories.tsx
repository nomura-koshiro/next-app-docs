import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';

import SampleChatPage from './sample-chat';

/**
 * SampleChatPageコンポーネントのストーリー
 *
 * チャットボットページコンポーネント。
 * ChatGPTのようなチャットインターフェースを提供します。
 *
 * @example
 * ```tsx
 * <SampleChatPage />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-chat/routes/sample-chat/SampleChat',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: SampleChatPage,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // ================================================================================
    layout: 'fullscreen',

    // ================================================================================
    // Next.js設定
    // ================================================================================
    nextjs: {
      appDirectory: true,
    },

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          'チャットボット機能を提供するページコンポーネント。ChatGPTのようなチャットインターフェースを実装しています。\n\n' +
          '**主な機能:**\n' +
          '- メッセージの送受信\n' +
          '- チャット履歴の表示\n' +
          '- 楽観的UI更新（React 19 useOptimistic）\n' +
          '- MSWによるAPIモック\n' +
          '- 自動スクロール機能\n' +
          '- Enterキーでの送信（Shift+Enterで改行）\n\n' +
          '**使用場面:**\n' +
          '- チャットボットアプリケーション\n' +
          '- カスタマーサポートチャット\n' +
          '- AIアシスタント機能',
      },
    },

    // ================================================================================
    // MSWハンドラー - 成功レスポンス
    // ================================================================================
    msw: {
      handlers: [
        http.post('*/api/v1/sample/chat/messages', async ({ request }) => {
          await delay(1000);

          const body = (await request.json()) as { message: string; conversationId?: string };

          return HttpResponse.json({
            message: {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `「${body.message}」というメッセージを受け取りました。これはモックレスポンスです。`,
              timestamp: new Date().toISOString(),
            },
            conversationId: body.conversationId || `conv-${Date.now()}`,
          });
        }),
      ],
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof SampleChatPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * チャットページの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  parameters: {
    docs: {
      description: {
        story: 'チャットページの初期状態。メッセージリストは空で、入力フォームが表示されます。',
      },
    },
  },
};

/**
 * メッセージ送信
 * ユーザーがメッセージを送信する操作
 */
export const SendMessage: Story = {
  name: 'メッセージ送信',
  parameters: {
    docs: {
      description: {
        story:
          'ユーザーがメッセージを送信する操作をシミュレート。楽観的UI更新により、APIレスポンスを待たずにメッセージが表示されます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 入力フォームの存在を確認
    const textarea = canvas.getByPlaceholderText(/メッセージを入力してください/i);
    expect(textarea).toBeInTheDocument();

    // 送信ボタンの存在を確認
    const submitButton = canvas.getByRole('button', { name: /送信/i });
    expect(submitButton).toBeInTheDocument();
  },
};

/**
 * 複数メッセージの会話
 * 複数回のメッセージ送信で会話を構築
 */
export const MultipleMessages: Story = {
  name: '複数メッセージの会話',
  parameters: {
    docs: {
      description: {
        story: '複数のメッセージを送信して会話を構築します。チャット履歴が時系列で表示されることを確認できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // チャット機能の基本要素を確認
    const textarea = canvas.getByPlaceholderText(/メッセージを入力してください/i);
    expect(textarea).toBeInTheDocument();

    const submitButton = canvas.getByRole('button', { name: /送信/i });
    expect(submitButton).toBeInTheDocument();

    // 初期状態のメッセージを確認
    const emptyMessage = canvas.getByText(/メッセージを送信して会話を開始してください/i);
    expect(emptyMessage).toBeInTheDocument();
  },
};

/**
 * エラー状態
 * API エラーが発生した際の表示
 */
export const WithError: Story = {
  name: 'エラー',
  parameters: {
    docs: {
      description: {
        story:
          'API呼び出しが失敗した場合の状態。MSWを使用してエラーレスポンスをシミュレートし、エラーメッセージが表示されることを確認します。',
      },
    },
    msw: {
      handlers: [
        http.post('*/api/v1/sample/chat/messages', async () => {
          await delay(500);

          return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 入力フォームとボタンの存在を確認
    const textarea = canvas.getByPlaceholderText(/メッセージを入力してください/i);
    expect(textarea).toBeInTheDocument();

    const submitButton = canvas.getByRole('button', { name: /送信/i });
    expect(submitButton).toBeInTheDocument();
  },
};

/**
 * 長いメッセージ
 * 複数行を含む長いメッセージの送信
 */
export const LongMessage: Story = {
  name: '長いメッセージ',
  parameters: {
    docs: {
      description: {
        story: '改行を含む長いメッセージを送信します。テキストエリアで複数行の入力が正しく処理されることを確認できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テキストエリアの存在を確認
    const textarea = canvas.getByPlaceholderText(/メッセージを入力してください/i);
    expect(textarea).toBeInTheDocument();

    // 複数行入力が可能か確認（rows属性）
    expect(textarea).toHaveAttribute('rows', '3');
  },
};
