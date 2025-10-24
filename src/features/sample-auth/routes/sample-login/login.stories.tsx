import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';

import LoginPage from './login';

/**
 * LoginPageコンポーネントのストーリー
 *
 * ログインページコンポーネント。
 * ユーザー認証を行い、成功時にはユーザー一覧ページへ遷移します。
 *
 * @example
 * ```tsx
 * <LoginPage />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-auth/routes/sample-login/Login',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: LoginPage,

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
          'ユーザー認証を行うためのログインページコンポーネント。フォーム入力とAPI統合が実装されています。\n\n' +
          '**主な機能:**\n' +
          '- メールアドレスとパスワードによる認証\n' +
          '- React Hook Formによるフォーム制御\n' +
          '- Zodスキーマによるバリデーション\n' +
          '- API連携によるログイン処理\n' +
          '- エラーハンドリング\n' +
          '- MSWによるAPIモック\n' +
          '- 開発環境でのReact Hook Form DevTools表示\n\n' +
          '**使用場面:**\n' +
          '- アプリケーションのログイン画面\n' +
          '- 認証が必要な機能へのアクセス前',
      },
    },

    // ================================================================================
    // 背景色のテストオプション
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
    // MSWハンドラー - 成功レスポンス
    // ================================================================================
    msw: {
      handlers: [
        http.post('*/api/v1/sample/auth/login', async () => {
          await delay(500);

          return HttpResponse.json({
            token: 'mock-jwt-token-12345',
            user: {
              id: '1',
              name: '山田太郎',
              email: 'yamada@example.com',
            },
          });
        }),
      ],
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ログインページの通常状態
 */
export const Default: Story = {
  name: 'デフォルト',
  parameters: {
    docs: {
      description: {
        story: 'ログインページの初期状態。メールアドレスとパスワードの入力フォームが表示されます。',
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
        http.post('*/api/v1/sample/auth/login', async () => {
          await delay(500);

          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームに入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/i), 'user@example.com');
    await userEvent.type(canvas.getByLabelText(/パスワード/i), 'wrongpassword');

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole('button', { name: /ログイン/i });
    await userEvent.click(submitButton);

    // エラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/ログインに失敗しました。メールアドレスとパスワードを確認してください/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * 成功状態
 * ログインが成功した際の表示
 */
export const Success: Story = {
  name: '成功',
  parameters: {
    docs: {
      description: {
        story: 'ログインが成功した場合の状態。MSWを使用して成功レスポンスをシミュレートし、適切にログイン処理が行われることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームに入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/i), 'yamada@example.com');
    await userEvent.type(canvas.getByLabelText(/パスワード/i), 'password123');

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole('button', { name: /ログイン/i });
    await userEvent.click(submitButton);

    // ローディング状態になることを確認（ボタンが無効化される）
    expect(submitButton).toBeDisabled();
  },
};
