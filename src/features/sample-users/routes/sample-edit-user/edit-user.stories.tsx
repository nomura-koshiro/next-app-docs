import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';

import EditUserPage from './edit-user';

/**
 * EditUserPageコンポーネントのストーリー
 *
 * ユーザー編集ページコンポーネント。
 * 既存のユーザー情報を読み込み、編集してAPIに送信します。
 *
 * @example
 * ```tsx
 * <EditUserPage params={Promise.resolve({ id: "1" })} />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-users/routes/sample-edit-user/EditUser',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: EditUserPage,

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
          '既存ユーザーの情報を編集するためのページコンポーネント。データの読み込み、編集、保存が実装されています。\n\n' +
          '**主な機能:**\n' +
          '- ユーザーデータの読み込み\n' +
          '- ユーザー情報の編集フォーム\n' +
          '- バリデーション\n' +
          '- API連携による更新\n' +
          '- ローディング状態の表示\n' +
          '- エラーハンドリング\n' +
          '- MSWによるAPIモック\n\n' +
          '**使用場面:**\n' +
          '- ユーザー管理画面\n' +
          '- ユーザー情報の更新',
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof EditUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ユーザー編集ページの通常状態
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    params: Promise.resolve({ id: '1' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザー編集ページの初期状態。ユーザーデータが正常に読み込まれ、フォームに表示されます。',
      },
    },
  },
};

/**
 * ローディング状態
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: 'ローディング中',
  args: {
    params: Promise.resolve({ id: '1' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザーデータの読み込み中の状態。ローディングスピナーが表示されます。',
      },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/sample/users/:id', async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: {
              id: '1',
              name: '山田太郎',
              email: 'yamada@example.com',
              role: 'user',
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ローディングスピナーが表示されることを確認
    const loadingElement = canvas.getByTestId('loading-spinner');
    expect(loadingElement).toBeInTheDocument();
  },
};

/**
 * エラー状態
 * ユーザーデータの読み込みに失敗した状態
 */
export const WithError: Story = {
  name: 'エラー',
  args: {
    params: Promise.resolve({ id: '999' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザーデータの読み込みに失敗した場合の状態。存在しないIDを指定するとエラーメッセージが表示されます。',
      },
    },
    msw: {
      handlers: [
        http.get('*/api/v1/sample/users/:id', () => {
          return HttpResponse.json({ message: 'User not found' }, { status: 404 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ErrorBoundaryによるエラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/予期しないエラーが発生しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};
