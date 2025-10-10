import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./switch";
import { Label } from "@/components/ui/label";

const meta = {
  title: "components/ui/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="cursor-pointer">
        機内モード
      </Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked" className="cursor-pointer">
        有効
      </Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled" className="opacity-50">
        無効化されたスイッチ
      </Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked" className="opacity-50">
        無効化された有効状態
      </Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-center justify-between space-x-2 w-[400px]">
      <div className="space-y-0.5">
        <Label htmlFor="notifications" className="cursor-pointer">
          通知を有効にする
        </Label>
        <p className="text-sm text-muted-foreground">
          重要なお知らせをプッシュ通知で受け取ります
        </p>
      </div>
      <Switch id="notifications" />
    </div>
  ),
};

export const SettingsGroup: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="marketing" className="cursor-pointer">
            マーケティングメール
          </Label>
          <p className="text-sm text-muted-foreground">
            新機能やキャンペーン情報をメールで受け取ります
          </p>
        </div>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="social" className="cursor-pointer">
            SNS連携
          </Label>
          <p className="text-sm text-muted-foreground">
            SNSアカウントとの連携を有効にします
          </p>
        </div>
        <Switch id="social" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="security" className="cursor-pointer">
            二段階認証
          </Label>
          <p className="text-sm text-muted-foreground">
            ログイン時に追加の認証を要求します
          </p>
        </div>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="flex items-center justify-between space-x-2 w-[350px]">
      <div className="space-y-0.5">
        <Label htmlFor="dark-mode" className="cursor-pointer">
          ダークモード
        </Label>
        <p className="text-sm text-muted-foreground">
          ダークテーマでUIを表示します
        </p>
      </div>
      <Switch id="dark-mode" />
    </div>
  ),
};

export const PrivacySettings: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="profile-public" className="cursor-pointer">
            プロフィール公開
          </Label>
          <p className="text-sm text-muted-foreground">
            プロフィールを他のユーザーに公開します
          </p>
        </div>
        <Switch id="profile-public" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="activity-visible" className="cursor-pointer">
            アクティビティ表示
          </Label>
          <p className="text-sm text-muted-foreground">
            最終ログイン時刻を表示します
          </p>
        </div>
        <Switch id="activity-visible" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="search-indexing" className="cursor-pointer">
            検索エンジン登録
          </Label>
          <p className="text-sm text-muted-foreground">
            検索エンジンでプロフィールを表示可能にします
          </p>
        </div>
        <Switch id="search-indexing" />
      </div>
    </div>
  ),
};
