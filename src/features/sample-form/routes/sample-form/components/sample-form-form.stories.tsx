import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { type Control, useForm } from 'react-hook-form';

import { sampleFormSchema, type SampleFormValues } from '@/features/sample-form/schemas/sample-form.schema';

import { SampleForm } from './sample-form-form';

/**
 * SampleFormコンポーネントのストーリー
 *
 * すべてのフォーム部品の使用例を表示するサンプルフォームコンポーネント。
 * React Hook FormとZodによるバリデーションが統合されています。
 *
 * @example
 * ```tsx
 * <SampleForm
 *   control={control}
 *   onSubmit={handleSubmit}
 *   onReset={reset}
 *   isSubmitting={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-form/routes/sample-form/components/SampleForm',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: SampleForm,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'fullscreen',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          'すべてのフォーム部品の使用例を表示するサンプルフォームコンポーネント。React Hook FormとZodによるバリデーションが統合されています。\n\n' +
          '**主な機能:**\n' +
          '- Input, Select, Textarea, Checkbox, RadioGroup, Switch, Date など全てのフォーム部品の表示\n' +
          '- React Hook Formによる制御\n' +
          '- Zodスキーマによるバリデーション\n' +
          '- ローディング状態の表示\n' +
          '- フォームリセット機能\n\n' +
          '**使用場面:**\n' +
          '- フォーム部品の実装例の確認\n' +
          '- フォームバリデーションの学習\n' +
          '- UIコンポーネントの動作確認',
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
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    onSubmit: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof SampleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const dummyForm = {
  control: {} as Control<SampleFormValues>,
};

/**
 * デフォルト状態
 * フォームの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    control: dummyForm.control,
    isSubmitting: false,
  },
  render: (_args) => {
    const form = useForm<SampleFormValues>({
      resolver: zodResolver(sampleFormSchema),
      defaultValues: {
        username: '',
        email: '',
        age: undefined,
        country: '',
        bio: '',
        terms: false,
        newsletter: false,
        gender: 'male',
        notifications: true,
        darkMode: false,
        birthdate: '',
      },
    });

    return (
      <SampleForm
        control={form.control}
        onSubmit={form.handleSubmit((data) => {
          fn()();
          alert(JSON.stringify(data, null, 2));
        })}
        onReset={() => {
          fn()();
          form.reset();
        }}
        isSubmitting={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'フォームの初期状態。すべてのフィールドが空の状態で表示されます。',
      },
    },
  },
};

/**
 * 入力済み状態
 * フォームにデータが入力されている状態
 */
export const Filled: Story = {
  name: '入力済み',
  args: {
    control: dummyForm.control,
    isSubmitting: false,
  },
  render: (_args) => {
    const form = useForm<SampleFormValues>({
      resolver: zodResolver(sampleFormSchema),
      defaultValues: {
        username: 'yamada_taro',
        email: 'yamada@example.com',
        age: '25',
        country: 'jp',
        bio: 'こんにちは、山田太郎です。Webエンジニアとして働いています。趣味はプログラミングと読書です。',
        terms: true,
        newsletter: true,
        gender: 'male',
        notifications: true,
        darkMode: false,
        birthdate: '1998-01-15',
      },
    });

    return (
      <SampleForm
        control={form.control}
        onSubmit={form.handleSubmit((data) => {
          fn()();
          alert(JSON.stringify(data, null, 2));
        })}
        onReset={() => {
          fn()();
          form.reset();
        }}
        isSubmitting={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'フォームに有効なデータが入力されている状態。すべてのフィールドが適切に設定されています。',
      },
    },
  },
};

/**
 * 送信中状態
 * フォームが送信処理中の状態
 */
export const Submitting: Story = {
  name: '送信中',
  args: {
    control: dummyForm.control,
    isSubmitting: true,
  },
  render: (_args) => {
    const form = useForm<SampleFormValues>({
      resolver: zodResolver(sampleFormSchema),
      defaultValues: {
        username: 'yamada_taro',
        email: 'yamada@example.com',
        age: '25',
        country: 'jp',
        bio: 'こんにちは、山田太郎です。Webエンジニアとして働いています。趣味はプログラミングと読書です。',
        terms: true,
        newsletter: true,
        gender: 'male',
        notifications: true,
        darkMode: false,
        birthdate: '1998-01-15',
      },
    });

    return (
      <SampleForm
        control={form.control}
        onSubmit={form.handleSubmit((data) => {
          fn()();
          alert(JSON.stringify(data, null, 2));
        })}
        onReset={() => {
          fn()();
          form.reset();
        }}
        isSubmitting={true}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'フォームが送信処理中の状態。送信ボタンが無効化され、ローディング表示になります。',
      },
    },
  },
};
