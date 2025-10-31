import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/sample-ui/label";

import { Checkbox } from "./checkbox";

/**
 * Checkboxコンポーネントのストーリー
 *
 * チェックボックスコンポーネント。
 * 複数の選択肢から複数を選択したり、同意を確認する場面で使用します。
 *
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">利用規約に同意する</Label>
 * </div>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/sample-ui/Checkbox",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Checkbox,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "centered",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "チェック/未チェックの状態を切り替えるチェックボックスコンポーネント。\n\n" +
          "**主な機能:**\n" +
          "- チェック/未チェックの状態切り替え\n" +
          "- デフォルト値の設定\n" +
          "- 無効化状態の制御\n" +
          "- ラベルとの連携\n" +
          "- 説明文の追加が可能\n\n" +
          "**使用場面:**\n" +
          "- フォームでの複数選択\n" +
          "- 利用規約への同意\n" +
          "- タスクリスト\n" +
          "- フィルター条件の選択",
      },
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],

  // ================================================================================
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    defaultChecked: {
      control: "boolean",
      description: "初期チェック状態",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "状態",
      },
    },
    disabled: {
      control: "boolean",
      description: "無効化状態",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "状態",
      },
    },
    onCheckedChange: {
      description: "チェック状態変更時のコールバック関数",
      table: {
        type: { summary: "(checked: boolean) => void" },
        category: "イベント",
      },
    },
    className: {
      control: "text",
      description: "追加のCSSクラス名",
      table: {
        type: { summary: "string" },
        category: "スタイリング",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのCheckbox
 */
export const Default: Story = {
  name: "デフォルト",
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        利用規約に同意する
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "基本的なチェックボックス。ラベルと組み合わせて使用します。",
      },
    },
  },
};

/**
 * チェック済みの状態
 */
export const Checked: Story = {
  name: "チェック済み",
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked" className="cursor-pointer">
        チェック済み
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "初期状態がチェック済みのチェックボックス。デフォルトで選択状態にしたい項目に使用します。",
      },
    },
  },
};

/**
 * 無効化された状態
 */
export const Disabled: Story = {
  name: "無効",
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled" className="cursor-pointer opacity-50">
        無効化されたチェックボックス
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "無効化されたチェックボックス。ユーザーによる操作ができず、視覚的にもグレーアウト表示されます。",
      },
    },
  },
};

/**
 * 無効化されたチェック済み状態
 */
export const DisabledAndChecked: Story = {
  name: "無効かつチェック済み",
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked" className="cursor-pointer opacity-50">
        無効化されたチェック済み
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "無効化されているが、チェック済みの状態を示すチェックボックス。変更できない選択済み項目を表示する際に使用します。",
      },
    },
  },
};

/**
 * 説明文付き
 */
export const WithDescription: Story = {
  name: "説明文付き",
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="with-description" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="with-description" className="cursor-pointer">
          マーケティングメールを受け取る
        </Label>
        <p className="text-sm text-muted-foreground">新機能やキャンペーン情報をメールでお届けします</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "説明文を追加したチェックボックス。ユーザーが選択肢の内容を理解しやすくなります。",
      },
    },
  },
};

/**
 * 複数のチェックボックス
 */
export const MultipleCheckboxes: Story = {
  name: "複数のチェックボックス",
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" defaultChecked />
        <Label htmlFor="option1" className="cursor-pointer">
          オプション 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2" className="cursor-pointer">
          オプション 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3" className="cursor-pointer">
          オプション 3
        </Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "複数のチェックボックスをグループ化した例。フィルター条件の選択や興味のある項目の複数選択に使用します。",
      },
    },
  },
};
