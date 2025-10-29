// ================================================================================
// Imports
// ================================================================================

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import React from 'react';

import {
  authenticatedLoader,
  setAuthenticatedStorage,
  setUnauthenticatedStorage,
  unauthenticatedLoader,
} from '../../components/storybook-helpers';
import LoginPage from './login';

// ================================================================================
// デコレーター
// ================================================================================

/**
 * 認証済み状態を維持するデコレーター
 *
 * ストーリーの初期化時にsessionStorageとZustandストアを認証済み状態に設定します。
 *
 * @param Story - レンダリングするストーリーコンポーネント
 * @returns デコレートされたストーリー要素
 */
const AuthenticatedDecorator = (Story: () => React.ReactElement) => {
  React.useEffect(() => {
    setAuthenticatedStorage();
  }, []);

  return <Story />;
};

/**
 * 未認証状態を維持するデコレーター
 *
 * ストーリーの初期化時にsessionStorageとZustandストアを未認証状態に設定します。
 *
 * @param Story - レンダリングするストーリーコンポーネント
 * @returns デコレートされたストーリー要素
 */
const UnauthenticatedDecorator = (Story: () => React.ReactElement) => {
  React.useEffect(() => {
    setUnauthenticatedStorage();
  }, []);

  return <Story />;
};

// ================================================================================
// メタデータ
// ================================================================================

/**
 * ログインページのストーリー
 *
 * Azure Entra ID認証を使用したログインページのストーリー。
 * 開発モードと本番モードでの動作、ログイン操作などをテストします。
 */
const meta = {
  title: 'features/auth/routes/Login',
  component: LoginPage,

  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component:
          'Azure Entra ID認証を使用したログインページ。\n\n' +
          '**機能:**\n' +
          '- 開発モード: モックユーザーで即座にログイン\n' +
          '- 本番モード: Azure Entra IDの認証ページにリダイレクト\n\n' +
          '**使用場面:**\n' +
          '- アプリケーションのログインページ\n' +
          '- 未認証ユーザーのリダイレクト先',
      },
    },
  },

  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ================================================================================
// ストーリー定義
// ================================================================================

/**
 * デフォルトストーリー（未認証状態）
 *
 * 未認証状態でのログインページを表示します。
 * ログインボタンが表示され、クリックすると認証処理が実行されます。
 */
export const Default: Story = {
  name: 'デフォルト（未認証）',
  decorators: [UnauthenticatedDecorator],
  loaders: [unauthenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          '未認証状態でのログインページ。\n\n' +
          'ログインボタンをクリックすると、開発モードではモックユーザーとして認証されます。',
      },
    },
  },
};

/**
 * ログイン操作ストーリー
 *
 * ログインボタンをクリックする操作をテストします。
 * 開発モードでは即座にモックユーザーとして認証されます。
 */
export const LoginAction: Story = {
  name: 'ログイン操作',
  decorators: [UnauthenticatedDecorator],
  loaders: [unauthenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          'ログインボタンをクリックする操作のテスト。\n\n' +
          '開発モードでは即座にモックユーザーとして認証されます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ログインボタンを探す
    const loginButton = await canvas.findByRole('button', {
      name: /Microsoftアカウントでログイン/i,
    });
    expect(loginButton).toBeInTheDocument();

    // ログインボタンをクリック
    await userEvent.click(loginButton);

    // 開発モードでは即座にログイン処理が実行される
    // （実際のリダイレクトはStorybookでは発生しない）
  },
};

/**
 * 既に認証済みストーリー
 *
 * 既に認証済みのユーザーがログインページにアクセスした場合を表示します。
 * 実際のアプリケーションでは、認証済みユーザーは自動的にホームページにリダイレクトされます。
 */
export const AlreadyAuthenticated: Story = {
  name: '既に認証済み',
  decorators: [AuthenticatedDecorator],
  loaders: [authenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          '既に認証済みのユーザーがログインページにアクセスした場合。\n\n' +
          '実際のアプリケーションでは、認証済みユーザーは自動的にホームページにリダイレクトされるべきです。',
      },
    },
  },
};
