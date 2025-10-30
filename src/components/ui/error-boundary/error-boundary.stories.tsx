import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/components/sample-ui/button/button';

import { ErrorBoundary } from './error-boundary';

// ================================================================================
// エラーをスローするコンポーネント
// ================================================================================

const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

const ErrorTrigger = ({ errorMessage }: { errorMessage: string }) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    return <ThrowError message={errorMessage} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">正常に動作中</h1>
          <p className="text-gray-600">下のボタンをクリックすると、エラーが発生します</p>
        </div>
        <Button onClick={() => setShouldThrow(true)} className="w-full" size="lg">
          エラーを発生させる
        </Button>
      </div>
    </div>
  );
};

/**
 * エラー境界コンポーネントのストーリー
 *
 * React のエラー境界（Error Boundary）を実装した汎用コンポーネント。
 * コンポーネントツリー内のエラーをキャッチし、フォールバックUIを表示します。
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/ui/ErrorBoundary',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ErrorBoundary,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "fullscreen": 全画面表示（エラー画面は全画面で表示されるため）
    // ================================================================================
    layout: 'fullscreen',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          '汎用的なエラー境界コンポーネント。React コンポーネントツリー内のエラーをキャッチし、アプリケーション全体のクラッシュを防ぎます。\n\n' +
          '**主な機能:**\n' +
          '- エラーのキャッチと適切なフォールバックUIの表示\n' +
          '- カスタムフォールバックUIのサポート\n' +
          '- リダイレクト先のカスタマイズ可能\n' +
          '- エラーログの自動記録\n\n' +
          '**使用場面:**\n' +
          '- 保護されたルート（認証が必要なページ）\n' +
          '- 重要な機能モジュールのラップ\n' +
          '- ページ全体またはセクション単位でのエラーハンドリング',
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
  args: {
    children: null,
  },

  argTypes: {
    children: {
      control: false,
      description: 'ラップする子要素（React コンポーネント）',
      table: {
        type: { summary: 'ReactNode' },
        category: 'コンテンツ',
      },
    },
    fallback: {
      control: false,
      description: 'エラー発生時のカスタムフォールバックUI（オプション）',
      table: {
        type: { summary: '(error: Error, resetError: () => void) => ReactNode' },
        category: 'カスタマイズ',
      },
    },
    redirectTo: {
      control: 'text',
      description: 'リセット時のリダイレクト先（デフォルト: "/login"）',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/login' },
        category: 'カスタマイズ',
      },
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのエラー境界
 *
 * エラーが発生すると、デフォルトのフォールバックUIが表示されます。
 * シンプルなエラーメッセージとリロードボタンが表示されます。
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <ErrorBoundary>
      <ErrorTrigger errorMessage="予期しないエラーが発生しました" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのエラー境界UI。エラーメッセージとリロードボタンが表示されます。\n\n' +
          'カスタマイズなしで使用できる最もシンプルな形式です。',
      },
    },
  },
};

/**
 * カスタムリダイレクト先
 *
 * エラー発生時のリダイレクト先をカスタマイズできます。
 * 認証エラーの場合は `/login`、それ以外の場合は `/` など、用途に応じて設定できます。
 */
export const CustomRedirect: Story = {
  name: 'カスタムリダイレクト',
  render: () => (
    <ErrorBoundary redirectTo="/">
      <ErrorTrigger errorMessage="ホームページにリダイレクトされます" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story: 'リダイレクト先をカスタマイズした例。\n\n' + '`redirectTo` プロパティで、エラーリセット時の遷移先を指定できます。',
      },
    },
  },
};

/**
 * 認証エラー用のカスタマイズ例
 *
 * 認証エラー専用のフォールバックUIの例です。
 * 認証に特化したメッセージと、ログインページへのリダイレクトボタンを表示します。
 */
export const AuthenticationError: Story = {
  name: '認証エラー',
  render: () => (
    <ErrorBoundary
      redirectTo="/login"
      fallback={(error, resetError) => (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-red-600">認証エラー</h1>
              <p className="text-gray-600">{error.message || '認証処理中にエラーが発生しました'}</p>
            </div>
            <div className="space-y-4">
              <Button onClick={resetError} className="w-full" size="lg">
                ログインページに戻る
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      <ErrorTrigger errorMessage="認証トークンの有効期限が切れました" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story: '認証エラー専用のカスタマイズ例。\n\n' + 'カスタムフォールバックUIを使用して、認証に特化したエラー画面を表示できます。',
      },
    },
  },
};

/**
 * カスタムフォールバックUI（アイコン付き）
 *
 * エラー発生時に表示するUIを完全にカスタマイズできます。
 * この例では、アイコン、カスタムカラー、複数のアクションボタンを含む
 * リッチなエラー画面を実装しています。
 */
export const CustomFallback: Story = {
  name: 'カスタムフォールバック',
  render: () => (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div className="flex min-h-screen items-center justify-center bg-red-50">
          <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-600">カスタムエラー画面</h1>
              <p className="text-gray-600">{error.message}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={resetError} className="w-full bg-red-600 hover:bg-red-700" size="lg">
                再試行
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant="outline" className="w-full" size="lg">
                ホームに戻る
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      <ErrorTrigger errorMessage="これはカスタムエラーメッセージです" />
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '完全にカスタマイズされたフォールバックUIの例。\n\n' +
          'アイコン、カスタムカラー、複数のアクションボタンを含むリッチなエラー画面を実装できます。\n\n' +
          '`fallback` プロパティで、エラーオブジェクトとリセット関数を受け取り、自由にUIを構築できます。',
      },
    },
  },
};

/**
 * ネストされたエラー境界
 *
 * エラー境界は入れ子にすることができます。
 * 内側のエラー境界でキャッチできなかったエラーは、外側のエラー境界でキャッチされます。
 *
 * この機能により、アプリケーション全体とセクション単位で、
 * 異なるエラーハンドリングを実装できます。
 */
export const NestedErrorBoundary: Story = {
  name: 'ネストされたエラー境界',
  render: () => (
    <ErrorBoundary>
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">外側のエラー境界</h1>
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <p className="mb-4 text-blue-800">この領域は内側のエラー境界で保護されています</p>
          <ErrorBoundary
            fallback={(error) => (
              <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
                <h2 className="font-bold text-yellow-800">内側のエラー境界でキャッチ</h2>
                <p className="text-yellow-700">{error.message}</p>
              </div>
            )}
          >
            <ErrorTrigger errorMessage="内側のエラー境界でキャッチされます" />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ネストされたエラー境界の例。\n\n' +
          '内側のエラー境界がエラーをキャッチすると、外側には影響を与えません。\n\n' +
          'この機能により、アプリケーション全体とセクション単位で、異なるエラーハンドリングを実装できます。',
      },
    },
  },
};

/**
 * シンプルな使用例
 *
 * 最小限のコードでエラー境界を実装する例です。
 * プロパティなしでデフォルトの動作を使用します。
 */
export const SimpleUsage: Story = {
  name: 'シンプルな使用例',
  render: () => (
    <div className="p-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold">エラー境界の基本的な使用方法</h2>
        <p className="text-gray-600">コンポーネントをErrorBoundaryでラップするだけで、エラーハンドリングが有効になります。</p>
      </div>
      <ErrorBoundary>
        <ErrorTrigger errorMessage="シンプルなエラーメッセージ" />
      </ErrorBoundary>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '最小限のコードでエラー境界を実装する例。\n\n' +
          '```tsx\n' +
          '<ErrorBoundary>\n' +
          '  <YourComponent />\n' +
          '</ErrorBoundary>\n' +
          '```\n\n' +
          'プロパティなしでデフォルトの動作を使用できます。',
      },
    },
  },
};
