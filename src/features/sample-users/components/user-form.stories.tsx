import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { useEffect } from 'react';
import { type Control, useForm } from 'react-hook-form';

import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

import { UserForm } from './user-form';

/**
 * UserFormコンポーネントのストーリー
 *
 * ユーザー情報の作成・編集フォームコンポーネント。
 * React Hook FormとZodによるバリデーションを使用しています。
 *
 * @example
 * ```tsx
 * const { control, handleSubmit, formState } = useForm<UserFormValues>({
 *   resolver: zodResolver(userFormSchema),
 * });
 *
 * <UserForm
 *   control={control}
 *   onSubmit={handleSubmit(onSubmit)}
 *   onCancel={onCancel}
 *   errors={formState.errors}
 *   isSubmitting={formState.isSubmitting}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-users/components/UserForm',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: UserForm,

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
          'ユーザー情報の作成・編集を行うフォームコンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- React Hook Formによるフォーム管理\n' +
          '- Zodスキーマによるバリデーション\n' +
          '- 名前、メールアドレス、ロール（user/admin）の入力\n' +
          '- 送信中状態の制御\n' +
          '- エラーメッセージの表示\n' +
          '- 新規作成・編集モードの切り替え\n\n' +
          '**使用場面:**\n' +
          '- 新規ユーザー作成画面\n' +
          '- ユーザー情報編集画面',
      },
    },

    // ================================================================================
    // 背景色のテストオプション
    // 異なる背景色でコンポーネントの見た目を確認できます
    // ================================================================================
    backgrounds: {
      default: 'gray',
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
    control: {
      description: 'React Hook Formのcontrolオブジェクト',
      table: {
        type: { summary: 'Control<UserFormValues>' },
        category: 'フォーム制御',
      },
    },
    onSubmit: {
      description: 'フォーム送信時のコールバック関数',
      table: {
        type: { summary: '(e?: React.BaseSyntheticEvent) => Promise<void>' },
        category: 'イベント',
      },
    },
    onCancel: {
      description: 'キャンセルボタン押下時のコールバック関数',
      table: {
        type: { summary: '() => void' },
        category: 'イベント',
      },
    },
    errors: {
      description: 'React Hook Formのエラーオブジェクト',
      table: {
        type: { summary: 'FieldErrors<UserFormValues>' },
        category: 'フォーム制御',
      },
    },
    isSubmitting: {
      control: 'boolean',
      description: '送信中状態のフラグ',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    isEditMode: {
      control: 'boolean',
      description: '編集モードのフラグ（新規作成 or 編集）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
  },
} satisfies Meta<typeof UserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 新規ユーザー作成フォームの通常状態
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '',
        email: '',
        role: 'user',
      },
    });

    return <UserForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: '新規ユーザー作成時の初期状態。すべてのフィールドが空で、バリデーションエラーも表示されていません。',
      },
    },
  },
};

/**
 * 入力済み状態
 * フォームに値が入力されている状態
 */
export const WithValue: Story = {
  name: '入力済み',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'admin',
      },
    });

    return <UserForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'すべてのフィールドに有効な値が入力された状態。送信ボタンが有効になります。',
      },
    },
  },
};

/**
 * バリデーションエラー状態
 * フォームバリデーションエラーが表示されている状態
 */
export const ValidationError: Story = {
  name: 'バリデーションエラー',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
      trigger,
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '',
        email: '',
        role: 'user',
      },
    });

    // エラーを表示するために初期バリデーションを実行
    useEffect(() => {
      void trigger();
    }, [trigger]);

    return <UserForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story:
          '必須フィールドが空のままフォーム送信を試みた際のバリデーションエラー表示。各フィールドの下にエラーメッセージが表示されます。',
      },
    },
  },
};

/**
 * 送信中状態
 * フォーム送信中でボタンが無効化されている状態
 */
export const Submitting: Story = {
  name: '送信中',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: true,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user',
      },
    });

    return <UserForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={true} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: 'フォーム送信中の状態。送信ボタンとキャンセルボタンが無効化され、ローディング表示が表示されます。',
      },
    },
  },
};

/**
 * エラー状態
 * API通信エラーが表示されている状態
 */
export const WithError: Story = {
  name: 'エラー',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user',
      },
    });

    const errors = {
      root: {
        message: 'ユーザーの作成に失敗しました',
        type: 'manual',
      },
    };

    return <UserForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: 'API通信エラーなど、サーバー側でエラーが発生した際の表示。フォーム上部にエラーメッセージが表示されます。',
      },
    },
  },
};

/**
 * 編集モード
 * ユーザー編集フォームの通常状態
 */
export const EditMode: Story = {
  name: '編集モード',
  args: {
    control: {} as Control<UserFormValues>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
    isEditMode: true,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'admin',
      },
    });

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    );
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: '既存ユーザー情報を編集する際のモード。ボタンラベルが「作成」から「更新」に変わります。',
      },
    },
  },
};
