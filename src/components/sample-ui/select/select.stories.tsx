import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';

/**
 * Selectコンポーネントのストーリー
 *
 * shadcn/uiベースの選択式ドロップダウンコンポーネント。
 * 複数の選択肢から一つを選ぶUIを提供します。
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger className="w-[180px]">
 *     <SelectValue placeholder="選択してください" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">オプション1</SelectItem>
 *     <SelectItem value="option2">オプション2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Select',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Select,

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
          'ドロップダウン形式で選択肢を表示する選択コンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- ドロップダウンメニューによる選択\n' +
          '- グループ化されたアイテムの表示\n' +
          '- サイズバリエーション（標準、小）\n' +
          '- プレースホルダーテキストのサポート\n' +
          '- 無効化状態の制御\n' +
          '- キーボードナビゲーション対応\n\n' +
          '**使用場面:**\n' +
          '- フォームでの選択入力\n' +
          '- フィルター・ソート条件の選択\n' +
          '- 設定項目の選択\n' +
          '- カテゴリー選択',
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
    disabled: {
      control: 'boolean',
      description: '無効化状態',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    defaultValue: {
      control: 'text',
      description: '初期選択値',
      table: {
        type: { summary: 'string' },
        category: 'コンテンツ',
      },
    },
    onValueChange: {
      description: '選択値変更時のコールバック関数',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'イベント',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのSelect
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">りんご</SelectItem>
        <SelectItem value="banana">バナナ</SelectItem>
        <SelectItem value="orange">オレンジ</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なセレクトコンポーネント。ドロップダウンメニューから選択肢を選べます。',
      },
    },
  },
};

/**
 * グループ付きSelect
 */
export const WithGroups: Story = {
  name: 'グループ付き',
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="果物を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>果物</SelectLabel>
          <SelectItem value="apple">りんご</SelectItem>
          <SelectItem value="banana">バナナ</SelectItem>
          <SelectItem value="orange">オレンジ</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>野菜</SelectLabel>
          <SelectItem value="carrot">にんじん</SelectItem>
          <SelectItem value="lettuce">レタス</SelectItem>
          <SelectItem value="tomato">トマト</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: '選択肢をグループ化して表示。カテゴリー別の選択肢を整理して表示する場合に便利です。',
      },
    },
  },
};

/**
 * 小サイズのSelect
 */
export const SmallSize: Story = {
  name: '小サイズ',
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">XS</SelectItem>
        <SelectItem value="s">S</SelectItem>
        <SelectItem value="m">M</SelectItem>
        <SelectItem value="l">L</SelectItem>
        <SelectItem value="xl">XL</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: '小サイズのセレクト。コンパクトなUIが必要な場合に使用します。',
      },
    },
  },
};

/**
 * ラベル付きSelect
 */
export const WithLabel: Story = {
  name: 'ラベル付き',
  render: () => (
    <div className="space-y-2">
      <label htmlFor="role" className="text-sm font-medium">
        ロール
      </label>
      <Select>
        <SelectTrigger className="w-[180px]" id="role">
          <SelectValue placeholder="ロールを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">ユーザー</SelectItem>
          <SelectItem value="admin">管理者</SelectItem>
          <SelectItem value="moderator">モデレーター</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ラベルと組み合わせた実用的な使用例。アクセシビリティのためlabelとidを関連付けています。',
      },
    },
  },
};

/**
 * 無効化されたSelect
 */
export const Disabled: Story = {
  name: '無効',
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選択できません" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">オプション1</SelectItem>
        <SelectItem value="option2">オプション2</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: '無効化された状態のセレクト。ユーザーによる選択ができず、視覚的にもグレーアウト表示されます。',
      },
    },
  },
};

/**
 * フォームでの使用例
 */
export const InForm: Story = {
  name: 'フォーム内',
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          国<span className="text-red-500 ml-1">*</span>
        </label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="国を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jp">日本</SelectItem>
            <SelectItem value="us">アメリカ</SelectItem>
            <SelectItem value="uk">イギリス</SelectItem>
            <SelectItem value="fr">フランス</SelectItem>
            <SelectItem value="de">ドイツ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          言語
        </label>
        <Select>
          <SelectTrigger id="language">
            <SelectValue placeholder="言語を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ja">日本語</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="ko">한국어</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'フォーム内での実用例。必須項目の表示や複数のセレクトフィールドの組み合わせを示しています。',
      },
    },
  },
};
