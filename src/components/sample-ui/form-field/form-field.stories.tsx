import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Input } from '@/components/sample-ui/input';

import { FormField, InputField, SelectField } from './form-field';

/**
 * FormFieldコンポーネントのストーリー
 *
 * ラベル、入力フィールド、エラーメッセージを統合したフォームフィールドコンポーネント。
 * InputFieldやSelectFieldなど、特定の入力タイプに特化したコンポーネントも提供します。
 *
 * @example
 * ```tsx
 * <FormField label="名前" id="name" required>
 *   <Input placeholder="山田太郎" />
 * </FormField>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/FormField',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: FormField,

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
          'フォーム入力の標準的な構造を提供するコンポーネント。ラベル、入力要素、エラーメッセージを統合します。\n\n' +
          '**主な機能:**\n' +
          '- ラベルと入力フィールドの関連付け\n' +
          '- 必須フィールドの表示\n' +
          '- エラーメッセージの表示\n' +
          '- InputField、SelectFieldなどの便利なラッパー\n\n' +
          '**使用場面:**\n' +
          '- あらゆるフォーム入力\n' +
          '- ユーザー登録・編集フォーム\n' +
          '- 設定画面\n' +
          '- データ入力フォーム',
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
  argTypes: {
    label: {
      control: 'text',
      description: 'フィールドのラベルテキスト',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
      },
    },
    id: {
      control: 'text',
      description: 'フィールドのID（ラベルとの関連付けに使用）',
      table: {
        type: { summary: 'string' },
        category: '基本',
      },
    },
    required: {
      control: 'boolean',
      description: '必須フィールドかどうか',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'バリデーション',
      },
    },
    error: {
      control: 'text',
      description: 'エラーメッセージ',
      table: {
        type: { summary: 'string' },
        category: 'バリデーション',
      },
    },
    children: {
      control: false,
      description: '入力要素（Input、Selectなど）',
      table: {
        type: { summary: 'ReactNode' },
        category: 'コンテンツ',
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なFormField
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    label: 'ラベル',
    id: 'field1',
    children: <Input placeholder="入力してください" />,
  },
  render: () => (
    <FormField label="ラベル" id="field1">
      <Input placeholder="入力してください" />
    </FormField>
  ),
  parameters: {
    docs: {
      description: {
        story: '最も基本的なフォームフィールド。ラベルと入力フィールドを組み合わせた構成です。',
      },
    },
  },
};

/**
 * 必須フィールド
 */
export const Required: Story = {
  name: '必須',
  args: {
    label: '名前',
    id: 'name',
    required: true,
    children: <Input placeholder="山田太郎" required />,
  },
  render: () => (
    <FormField label="名前" id="name" required>
      <Input placeholder="山田太郎" required />
    </FormField>
  ),
  parameters: {
    docs: {
      description: {
        story: '必須フィールドの例。ラベルに赤いアスタリスクが表示され、ユーザーに必須入力であることを示します。',
      },
    },
  },
};

/**
 * エラー付きフィールド
 */
export const WithError: Story = {
  name: 'エラーあり',
  args: {
    label: 'メールアドレス',
    id: 'email',
    required: true,
    error: '有効なメールアドレスを入力してください',
    children: <Input type="email" placeholder="user@example.com" aria-invalid="true" />,
  },
  render: () => (
    <FormField label="メールアドレス" id="email" required error="有効なメールアドレスを入力してください">
      <Input type="email" placeholder="user@example.com" aria-invalid="true" />
    </FormField>
  ),
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラーがある状態のフィールド。エラーメッセージが赤色で表示されます。',
      },
    },
  },
};

/**
 * InputField コンポーネント
 */
export const InputFieldExample: Story = {
  name: '入力フィールド',
  args: {
    label: 'ユーザー名',
    id: 'username',
    children: <Input />,
  },
  render: () => {
    const [value, setValue] = useState('');

    return <InputField label="ユーザー名" id="username" value={value} onChange={setValue} placeholder="username" required />;
  },
  parameters: {
    docs: {
      description: {
        story: 'InputFieldは、FormFieldとInputを組み合わせた便利なコンポーネント。状態管理が組み込まれています。',
      },
    },
  },
};

/**
 * SelectField コンポーネント
 */
export const SelectFieldExample: Story = {
  name: 'セレクトフィールド',
  args: {
    label: 'ロール',
    id: 'role',
    children: <Input />,
  },
  render: () => {
    const [value, setValue] = useState('');

    return (
      <SelectField
        label="ロール"
        id="role"
        value={value}
        onChange={setValue}
        options={[
          { value: 'user', label: 'ユーザー' },
          { value: 'admin', label: '管理者' },
          { value: 'moderator', label: 'モデレーター' },
        ]}
        required
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'SelectFieldは、FormFieldとSelectを組み合わせた便利なコンポーネント。選択肢から1つを選ぶ入力に使用します。',
      },
    },
  },
};

/**
 * フォームの例
 */
export const CompleteForm: Story = {
  name: '完全なフォーム',
  args: {
    label: 'フォーム',
    id: 'form',
    children: <Input />,
  },
  render: () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    return (
      <div className="w-96 space-y-4">
        <InputField label="名前" id="name" value={name} onChange={setName} placeholder="山田太郎" required />
        <InputField
          label="メールアドレス"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="yamada@example.com"
          required
        />
        <SelectField
          label="ロール"
          id="role"
          value={role}
          onChange={setRole}
          options={[
            { value: 'user', label: 'ユーザー' },
            { value: 'admin', label: '管理者' },
          ]}
          required
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '複数のフィールドを組み合わせた実用的なフォームの例。すべてのフィールドが統一されたスタイルで表示されます。',
      },
    },
  },
};

/**
 * エラー状態のフォーム
 */
export const FormWithErrors: Story = {
  name: 'エラーのあるフォーム',
  args: {
    label: 'フォーム',
    id: 'form',
    children: <Input />,
  },
  render: () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('invalid-email');

    return (
      <div className="w-96 space-y-4">
        <InputField label="名前" id="name" value={name} onChange={setName} placeholder="山田太郎" required error="名前を入力してください" />
        <InputField
          label="メールアドレス"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="user@example.com"
          required
          error="有効なメールアドレスを入力してください"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラーが発生している状態のフォーム。各フィールドにエラーメッセージが表示されています。',
      },
    },
  },
};
