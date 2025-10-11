import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "components/ui/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なカード
 */
export const Default: Story = {
  name: "デフォルト",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文がここに入ります。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * フッター付きカード
 */
export const WithFooter: Story = {
  name: "フッター付き",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>フッター付きカード</CardTitle>
        <CardDescription>
          フッターにアクションボタンを配置できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          キャンセル
        </Button>
        <Button className="w-full ml-2">保存</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * アクション付きカード
 */
export const WithAction: Story = {
  name: "アクション付き",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>アクション付きカード</CardTitle>
        <CardDescription>ヘッダーにアクションボタンを配置</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            編集
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツエリアです。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * シンプルなカード
 */
export const Simple: Story = {
  name: "シンプル",
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p>ヘッダーなしのシンプルなカードです。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * フォーム用カード
 */
export const FormCard: Story = {
  name: "フォーム",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>アカウントにログインしてください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="パスワード"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">ログイン</Button>
      </CardFooter>
    </Card>
  ),
};
