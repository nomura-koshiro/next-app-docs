import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from '@/components/sample-ui/label';

import { Switch } from './switch';

/**
 * Switchコンポーネントのストーリー
 *
 * オン/オフ切り替えを行うスイッチコンポーネント。
 * 設定のオン/オフなど、二値の状態を切り替える場面で使用します。
 *
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode">機内モード</Label>
 * </div>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'components/sample-ui/Switch',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: Switch,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'centered',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          'オン/オフの二値状態を切り替えるスイッチコンポーネント。\n\n' +
          '**主な機能:**\n' +
          '- オン/オフの状態切り替え\n' +
          '- デフォルト値の設定\n' +
          '- 無効化状態の制御\n' +
          '- ラベルとの連携\n' +
          '- アニメーション付きの状態遷移\n\n' +
          '**使用場面:**\n' +
          '- 設定画面での機能のオン/オフ\n' +
          '- 通知設定\n' +
          '- プライバシー設定\n' +
          '- ダークモード切り替え',
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
    defaultChecked: {
      control: 'boolean',
      description: '初期チェック状態',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
    onCheckedChange: {
      description: 'チェック状態変更時のコールバック関数',
      table: {
        type: { summary: '(checked: boolean) => void' },
        category: 'イベント',
      },
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス名',
      table: {
        type: { summary: 'string' },
        category: 'スタイリング',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのSwitch
 */
export const Default: Story = {
  name: 'デフォルト',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="cursor-pointer">
        機内モード
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なスイッチコンポーネント。ラベルと組み合わせて使用します。',
      },
    },
  },
};

/**
 * チェック済みの状態
 */
export const Checked: Story = {
  name: 'チェック済み',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked" className="cursor-pointer">
        有効
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '初期状態がオンになっているスイッチ。デフォルトで有効にしたい機能に使用します。',
      },
    },
  },
};

/**
 * 無効化された状態
 */
export const Disabled: Story = {
  name: '無効',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled" className="opacity-50">
        無効化されたスイッチ
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '無効化されたスイッチ。ユーザーによる操作ができず、視覚的にもグレーアウト表示されます。',
      },
    },
  },
};

/**
 * 無効化されたチェック済み状態
 */
export const DisabledAndChecked: Story = {
  name: '無効かつチェック済み',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked" className="opacity-50">
        無効化された有効状態
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '無効化されているが、オンの状態を示すスイッチ。変更できない設定を表示する際に使用します。',
      },
    },
  },
};

/**
 * 説明文付き
 */
export const WithDescription: Story = {
  name: '説明文付き',
  render: () => (
    <div className="flex items-center justify-between space-x-2 w-[400px]">
      <div className="space-y-0.5">
        <Label htmlFor="notifications" className="cursor-pointer">
          通知を有効にする
        </Label>
        <p className="text-sm text-muted-foreground">重要なお知らせをプッシュ通知で受け取ります</p>
      </div>
      <Switch id="notifications" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '説明文を追加したスイッチ。ユーザーが設定の内容を理解しやすくなります。',
      },
    },
  },
};

/**
 * 設定グループの例
 */
export const SettingsGroup: Story = {
  name: '設定グループ',
  render: () => (
    <div className="w-[500px] space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="marketing" className="cursor-pointer">
            マーケティングメール
          </Label>
          <p className="text-sm text-muted-foreground">新機能やキャンペーン情報をメールで受け取ります</p>
        </div>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="social" className="cursor-pointer">
            SNS連携
          </Label>
          <p className="text-sm text-muted-foreground">SNSアカウントとの連携を有効にします</p>
        </div>
        <Switch id="social" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="security" className="cursor-pointer">
            二段階認証
          </Label>
          <p className="text-sm text-muted-foreground">ログイン時に追加の認証を要求します</p>
        </div>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '複数のスイッチをグループ化した設定画面の例。各スイッチに説明文が付いています。',
      },
    },
  },
};

/**
 * ダークモード切り替えの例
 */
export const DarkMode: Story = {
  name: 'ダークモード',
  render: () => (
    <div className="flex items-center justify-between space-x-2 w-[350px]">
      <div className="space-y-0.5">
        <Label htmlFor="dark-mode" className="cursor-pointer">
          ダークモード
        </Label>
        <p className="text-sm text-muted-foreground">ダークテーマでUIを表示します</p>
      </div>
      <Switch id="dark-mode" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ダークモード切り替えの実用例。テーマ切り替え機能などで使用されます。',
      },
    },
  },
};

/**
 * プライバシー設定の例
 */
export const PrivacySettings: Story = {
  name: 'プライバシー設定',
  render: () => (
    <div className="w-[500px] space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="profile-public" className="cursor-pointer">
            プロフィール公開
          </Label>
          <p className="text-sm text-muted-foreground">プロフィールを他のユーザーに公開します</p>
        </div>
        <Switch id="profile-public" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="activity-visible" className="cursor-pointer">
            アクティビティ表示
          </Label>
          <p className="text-sm text-muted-foreground">最終ログイン時刻を表示します</p>
        </div>
        <Switch id="activity-visible" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="search-indexing" className="cursor-pointer">
            検索エンジン登録
          </Label>
          <p className="text-sm text-muted-foreground">検索エンジンでプロフィールを表示可能にします</p>
        </div>
        <Switch id="search-indexing" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'プライバシー設定画面の例。複数のプライバシー関連設定をスイッチで管理します。',
      },
    },
  },
};
