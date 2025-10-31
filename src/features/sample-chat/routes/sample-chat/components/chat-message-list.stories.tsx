import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Message } from "../../../types";
import { ChatMessageList } from "./chat-message-list";

/**
 * ChatMessageListコンポーネントのストーリー
 *
 * チャットメッセージリストコンポーネント。メッセージ履歴を表示し、
 * 自動スクロールを管理します。
 *
 * @example
 * ```tsx
 * <ChatMessageList
 *   messages={messages}
 *   isSending={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/sample-chat/routes/sample-chat/components/ChatMessageList",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ChatMessageList,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "padded",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "チャットメッセージの履歴を表示するコンポーネント。新しいメッセージが追加されると自動的にスクロールします。\n\n" +
          "**主な機能:**\n" +
          "- メッセージリストの表示\n" +
          "- 新しいメッセージへの自動スクロール\n" +
          "- 送信中のローディング表示\n" +
          "- 空の状態のプレースホルダー\n" +
          "- 固定高さでのスクロール可能なコンテナ\n\n" +
          "**使用場面:**\n" +
          "- チャットアプリケーション\n" +
          "- メッセージング機能\n" +
          "- カスタマーサポートチャット",
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
    messages: {
      description: "メッセージリスト",
      table: {
        type: { summary: "Message[]" },
        category: "データ",
      },
    },
    isSending: {
      control: "boolean",
      description: "送信中かどうか",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "状態",
      },
    },
  },

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    messages: [],
    isSending: false,
  },
} satisfies Meta<typeof ChatMessageList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 空の状態
 * メッセージが1件もない初期状態
 */
export const Empty: Story = {
  name: "空の状態",
  args: {
    messages: [],
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: "メッセージが1件もない初期状態。プレースホルダーテキストが表示されます。",
      },
    },
  },
};

/**
 * 1件のメッセージ
 * ユーザーメッセージが1件のみの状態
 */
export const SingleMessage: Story = {
  name: "1件のメッセージ",
  args: {
    messages: [
      {
        id: "1",
        role: "user",
        content: "こんにちは！",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
    ] as Message[],
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザーメッセージが1件のみ表示されている状態。",
      },
    },
  },
};

/**
 * 複数のメッセージ
 * ユーザーとアシスタントの会話履歴
 */
export const MultipleMessages: Story = {
  name: "複数のメッセージ",
  args: {
    messages: [
      {
        id: "1",
        role: "user",
        content: "こんにちは！今日はいい天気ですね。",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
      {
        id: "2",
        role: "assistant",
        content: "こんにちは！はい、とても良い天気ですね。お出かけ日和ですよ。",
        timestamp: new Date("2025-01-15T10:30:05"),
      },
      {
        id: "3",
        role: "user",
        content: "おすすめの過ごし方はありますか？",
        timestamp: new Date("2025-01-15T10:30:15"),
      },
      {
        id: "4",
        role: "assistant",
        content: "公園での散歩やカフェでゆっくり過ごすのがおすすめです。気分転換にもなりますよ。",
        timestamp: new Date("2025-01-15T10:30:20"),
      },
    ] as Message[],
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザーとアシスタントの往復のある会話履歴。複数のメッセージが時系列で表示されます。",
      },
    },
  },
};

/**
 * 長い会話履歴
 * スクロールが必要な長い会話
 */
export const LongConversation: Story = {
  name: "長い会話履歴",
  args: {
    messages: [
      {
        id: "1",
        role: "user",
        content: "プロジェクトの進捗について教えてください。",
        timestamp: new Date("2025-01-15T09:00:00"),
      },
      {
        id: "2",
        role: "assistant",
        content: "現在、フェーズ2が完了し、フェーズ3に入りました。順調に進んでいます。",
        timestamp: new Date("2025-01-15T09:00:05"),
      },
      {
        id: "3",
        role: "user",
        content: "次のマイルストーンはいつですか？",
        timestamp: new Date("2025-01-15T09:05:00"),
      },
      {
        id: "4",
        role: "assistant",
        content: "次のマイルストーンは2週間後の1月29日です。",
        timestamp: new Date("2025-01-15T09:05:05"),
      },
      {
        id: "5",
        role: "user",
        content: "そのマイルストーンで達成すべき目標を教えてください。",
        timestamp: new Date("2025-01-15T09:10:00"),
      },
      {
        id: "6",
        role: "assistant",
        content: "以下の3つが主な目標です：\n1. ユーザー認証機能の実装完了\n2. データベース設計のレビュー\n3. APIエンドポイントの実装",
        timestamp: new Date("2025-01-15T09:10:05"),
      },
      {
        id: "7",
        role: "user",
        content: "ありがとうございます。現在のリスクはありますか？",
        timestamp: new Date("2025-01-15T09:15:00"),
      },
      {
        id: "8",
        role: "assistant",
        content: "いくつか懸念事項があります。サードパーティAPIの統合に予想以上に時間がかかっています。",
        timestamp: new Date("2025-01-15T09:15:05"),
      },
      {
        id: "9",
        role: "user",
        content: "その問題への対策は考えていますか？",
        timestamp: new Date("2025-01-15T09:20:00"),
      },
      {
        id: "10",
        role: "assistant",
        content: "はい、追加のリソースを割り当てることと、代替APIの検討も進めています。",
        timestamp: new Date("2025-01-15T09:20:05"),
      },
    ] as Message[],
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: "長い会話履歴。コンテナ内でスクロール可能になります。",
      },
    },
  },
};

/**
 * 送信中の状態
 * ユーザーメッセージを送信中でアシスタントの返信を待っている状態
 */
export const Sending: Story = {
  name: "送信中",
  args: {
    messages: [
      {
        id: "1",
        role: "user",
        content: "こんにちは！",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
      {
        id: "2",
        role: "assistant",
        content: "こんにちは！何かお手伝いできることはありますか？",
        timestamp: new Date("2025-01-15T10:30:05"),
      },
      {
        id: "3",
        role: "user",
        content: "今日の天気について教えてください。",
        timestamp: new Date("2025-01-15T10:31:00"),
      },
    ] as Message[],
    isSending: true,
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザーメッセージを送信中で、アシスタントの返信を待っている状態。ローディングインジケーターが表示されます。",
      },
    },
  },
};

/**
 * 複数行メッセージを含む会話
 * 改行のあるメッセージを含む会話
 */
export const WithMultilineMessages: Story = {
  name: "複数行メッセージ",
  args: {
    messages: [
      {
        id: "1",
        role: "user",
        content: "今日のタスクリストを教えてください。",
        timestamp: new Date("2025-01-15T10:00:00"),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "今日のタスクリストです：\n\n1. 朝のミーティング（9:00-10:00）\n2. ドキュメント作成（10:00-12:00）\n3. コードレビュー（13:00-14:00）\n4. クライアントミーティング（15:00-16:00）",
        timestamp: new Date("2025-01-15T10:00:05"),
      },
      {
        id: "3",
        role: "user",
        content: "ありがとうございます！\n\n優先度が高いタスクはどれですか？",
        timestamp: new Date("2025-01-15T10:05:00"),
      },
      {
        id: "4",
        role: "assistant",
        content:
          "最も優先度が高いのは以下の2つです：\n\n• クライアントミーティング\n• ドキュメント作成\n\nこの2つを重点的に進めることをおすすめします。",
        timestamp: new Date("2025-01-15T10:05:05"),
      },
    ] as Message[],
    isSending: false,
  },
  parameters: {
    docs: {
      description: {
        story: "改行を含むメッセージが含まれた会話。リスト形式や構造化された情報も適切に表示されます。",
      },
    },
  },
};
