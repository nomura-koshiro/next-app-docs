import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

/**
 * ボタンコンポーネントのストーリー
 *
 * shadcn/uiベースの再利用可能なボタンコンポーネント。
 * 複数のバリエーションとサイズをサポートします。
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default">
 *   ボタン
 * </Button>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/sample-ui/Button",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Button,

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
          "汎用的なボタンコンポーネント。様々なバリエーションとサイズを提供します。\n\n" +
          "**主な機能:**\n" +
          "- 6種類のバリエーション（default, destructive, outline, secondary, ghost, link）\n" +
          "- 4種類のサイズ（default, sm, lg, icon）\n" +
          "- 無効化状態のサポート\n" +
          "- Radix UI Slotによる柔軟なレンダリング\n\n" +
          "**使用場面:**\n" +
          "- フォームの送信・キャンセル\n" +
          "- 破壊的なアクション（削除など）\n" +
          "- ナビゲーション",
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
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "ボタンのバリエーション",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "default" },
        category: "外観",
      },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "ボタンのサイズ",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "default" },
        category: "外観",
      },
    },
    asChild: {
      control: "boolean",
      description: "Slotとして動作するかどうか（子要素をそのままレンダリング）",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "動作",
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
    children: {
      control: "text",
      description: "ボタンの内容（テキストまたはReactNode）",
      table: {
        type: { summary: "ReactNode" },
        category: "コンテンツ",
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

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    children: "ボタン",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのボタン
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    children: "ボタン",
    variant: "default",
    size: "default",
  },
  parameters: {
    docs: {
      description: {
        story: "最も基本的なボタン。主要なアクションに使用します。",
      },
    },
  },
};

/**
 * 破壊的なアクション用のボタン（削除など）
 */
export const Destructive: Story = {
  name: "破壊的アクション",
  args: {
    children: "削除",
    variant: "destructive",
  },
  parameters: {
    docs: {
      description: {
        story: "削除やデータの破棄など、取り返しのつかないアクションに使用します。赤色で警告を示します。",
      },
    },
  },
};

/**
 * アウトラインスタイル
 */
export const Outline: Story = {
  name: "アウトライン",
  args: {
    children: "アウトライン",
    variant: "outline",
  },
};

/**
 * セカンダリスタイル
 */
export const Secondary: Story = {
  name: "セカンダリ",
  args: {
    children: "セカンダリ",
    variant: "secondary",
  },
};

/**
 * ゴーストスタイル（背景なし）
 */
export const Ghost: Story = {
  name: "ゴースト",
  args: {
    children: "ゴースト",
    variant: "ghost",
  },
};

/**
 * リンクスタイル
 */
export const Link: Story = {
  name: "リンク",
  args: {
    children: "リンク",
    variant: "link",
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  name: "小サイズ",
  args: {
    children: "小",
    size: "sm",
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  name: "大サイズ",
  args: {
    children: "大",
    size: "lg",
  },
};

/**
 * アイコンのみ
 */
export const Icon: Story = {
  name: "アイコン",
  args: {
    children: "🔔",
    size: "icon",
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  name: "無効化",
  args: {
    children: "無効化",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "無効化された状態のボタン。クリックできず、視覚的にグレーアウト表示されます。",
      },
    },
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  name: "ローディング",
  render: () => (
    <Button disabled>
      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      読み込み中...
    </Button>
  ),
};

/**
 * アイコンとテキストの組み合わせ
 */
export const WithIcon: Story = {
  name: "アイコン付き",
  render: () => (
    <div className="flex gap-2">
      <Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        項目を追加
      </Button>
      <Button variant="outline">
        ダウンロード
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </Button>
    </div>
  ),
};
