import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';

import NewUserPage from './new-user';

/**
 * NewUserPageコンポーネントのストーリー
 *
 * 新規ユーザー作成ページコンポーネント。
 * ユーザー情報を入力してAPIに送信し、新しいユーザーを作成します。
 *
 * @example
 * ```tsx
 * <NewUserPage />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-users/routes/sample-new-user/NewUser',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: NewUserPage,

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
          '新規ユーザーを作成するためのページコンポーネント。フォーム入力とAPI統合が実装されています。\n\n' +
          '**主な機能:**\n' +
          '- ユーザー情報の入力フォーム\n' +
          '- バリデーション\n' +
          '- API連携によるユーザー作成\n' +
          '- エラーハンドリング\n' +
          '- MSWによるAPIモック\n\n' +
          '**使用場面:**\n' +
          '- ユーザー管理画面\n' +
          '- 管理者による新規ユーザー登録',
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof NewUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 新規ユーザー作成ページの通常状態
 */
export const Default: Story = {
  name: 'デフォルト',
  parameters: {
    docs: {
      description: {
        story: '新規ユーザー作成ページの初期状態。空のフォームが表示されます。',
      },
    },
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
        http.post('*/api/v1/sample/users', async () => {
          await delay(500);

          return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Formに入力
    await userEvent.type(canvas.getByLabelText(/名前/i), '山田太郎');
    await userEvent.type(canvas.getByLabelText(/メールアドレス/i), 'yamada@example.com');

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole('button', { name: /作成/i });
    await userEvent.click(submitButton);

    // エラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/ユーザーの作成に失敗しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};
