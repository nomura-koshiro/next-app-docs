import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import type { User } from '@/features/sample-users/types';

import { DeleteUserConfirmation } from './delete-user-confirmation';

/**
 * DeleteUserConfirmationコンポーネントのストーリー
 *
 * ユーザー削除確認コンポーネント。
 * ユーザー情報を表示し、削除の確認を求めます。
 *
 * @example
 * ```tsx
 * <DeleteUserConfirmation
 *   user={user}
 *   isDeleting={false}
 *   deleteError={null}
 *   onDelete={handleDelete}
 *   onCancel={handleCancel}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-users/routes/sample-delete-user/components/DeleteUserConfirmation',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: DeleteUserConfirmation,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // ================================================================================
    layout: 'padded',

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          'ユーザー削除の確認を行うコンポーネント。削除対象のユーザー情報を表示し、確認または キャンセルを選択できます。\n\n' +
          '**主な機能:**\n' +
          '- ユーザー情報の表示\n' +
          '- 削除の確認\n' +
          '- 削除中の状態表示\n' +
          '- エラーメッセージの表示\n' +
          '- キャンセル機能\n\n' +
          '**使用場面:**\n' +
          '- ユーザー削除ページ\n' +
          '- 削除前の最終確認',
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],

  // ================================================================================
  // デフォルトの args 値
  // ================================================================================
  args: {
    onDelete: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteUserConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser: User = {
  id: '1',
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'user',
  createdAt: '2024-01-15',
};

/**
 * デフォルト状態
 * ユーザー削除確認の通常状態（一般ユーザー）
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    user: mockUser,
    isDeleting: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザー削除確認の初期状態。削除対象のユーザー情報が表示され、削除またはキャンセルを選択できます。',
      },
    },
  },
};

/**
 * 削除中状態
 * ユーザー削除処理中でボタンが無効化されている状態
 */
export const Deleting: Story = {
  name: '削除中',
  args: {
    user: mockUser,
    isDeleting: true,
  },
  parameters: {
    docs: {
      description: {
        story: '削除処理中の状態。ボタンが無効化され、ローディングインジケーターが表示されます。',
      },
    },
  },
};

/**
 * エラー状態
 * ユーザー削除に失敗してエラーメッセージが表示されている状態
 */
export const WithError: Story = {
  name: 'エラー',
  args: {
    user: mockUser,
    isDeleting: false,
  },
  parameters: {
    docs: {
      description: {
        story: '削除に失敗した場合の状態。エラーメッセージが表示され、再度削除を試みることができます。',
      },
    },
  },
};
