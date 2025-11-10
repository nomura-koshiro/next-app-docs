import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

/**
 * Dialogコンポーネントのストーリー
 *
 * Radix UIのDialogプリミティブをベースにした、アクセシブルなダイアログコンポーネント。
 * モーダルウィンドウとして使用され、ユーザーの注意を引く重要な情報や操作を表示します。
 *
 * **主な機能:**
 * - オーバーレイによる背景のブロック
 * - ESCキーやオーバーレイクリックで閉じる
 * - フォーカストラップ（ダイアログ内でフォーカスが循環）
 * - アニメーション付きの開閉
 * - カスタマイズ可能なサイズとスタイル
 * - アクセシビリティ対応（ARIA属性、キーボードナビゲーション）
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>開く</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>タイトル</DialogTitle>
 *       <DialogDescription>説明文</DialogDescription>
 *     </DialogHeader>
 *     <div>コンテンツ</div>
 *     <DialogFooter>
 *       <Button>OK</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radix UIのDialogプリミティブをベースにしたアクセシブルなダイアログコンポーネント。\n\n" +
          "**使用場面:**\n" +
          "- 確認ダイアログ（削除、保存など）\n" +
          "- フォーム入力\n" +
          "- 詳細情報の表示\n" +
          "- 警告やエラーメッセージ\n\n" +
          "**アクセシビリティ:**\n" +
          '- role="dialog"とaria-modal="true"が自動的に設定される\n' +
          "- フォーカストラップにより、ダイアログ外への移動を防ぐ\n" +
          "- ESCキーで閉じることができる\n" +
          "- オーバーレイクリックで閉じることができる",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例
 *
 * DialogTriggerボタンをクリックするとダイアログが開きます。
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ダイアログタイトル</DialogTitle>
          <DialogDescription>これはダイアログの説明文です。ダイアログの目的や内容を簡潔に説明します。</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">ここにメインコンテンツが入ります。</p>
        </div>
        <DialogFooter>
          <Button variant="outline">キャンセル</Button>
          <Button>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 制御されたダイアログ
 *
 * open と onOpenChange を使用して、外部から開閉状態を制御します。
 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>開く</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            閉じる
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">現在の状態: {open ? "開いている" : "閉じている"}</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>制御されたダイアログ</DialogTitle>
              <DialogDescription>このダイアログは外部のstateで制御されています。</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">外部のボタンやstateから開閉状態を制御できます。</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

/**
 * 確認ダイアログ
 *
 * 削除や重要な操作の確認に使用されるパターン。
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">削除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>本当に削除しますか？</DialogTitle>
          <DialogDescription>この操作は取り消せません。削除されたデータは復元できません。</DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">⚠️ 警告: このアクションは元に戻せません</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button variant="destructive">削除する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * フォーム入力ダイアログ
 *
 * ダイアログ内でフォーム入力を行うパターン。
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>プロフィールを編集</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
          <DialogDescription>プロフィール情報を更新します。</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              名前
            </label>
            <input id="name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="山田 太郎" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="yamada@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              自己紹介
            </label>
            <textarea
              id="bio"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="自己紹介を入力"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * カスタムサイズ
 *
 * max-w-* クラスでダイアログのサイズをカスタマイズできます。
 */
export const CustomSize: Story = {
  render: () => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">小（sm）</Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>小サイズ</DialogTitle>
            <DialogDescription>max-w-sm (384px)</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">小さいダイアログです。</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">中（md）</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>中サイズ</DialogTitle>
            <DialogDescription>max-w-md (448px)</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">中くらいのダイアログです。</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">大（2xl）</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>大サイズ</DialogTitle>
            <DialogDescription>max-w-2xl (672px)</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">大きいダイアログです。フォームなどのコンテンツに適しています。</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

/**
 * スクロール可能なコンテンツ
 *
 * コンテンツが長い場合は、ダイアログ内でスクロールできます。
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>利用規約を表示</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>利用規約</DialogTitle>
          <DialogDescription>サービス利用規約をお読みください。</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto py-4">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="mb-4 text-sm">
              第{i + 1}条:
              これはダミーの利用規約テキストです。実際の利用規約では、サービスの利用条件、禁止事項、免責事項などが詳しく記載されます。
              長いコンテンツの場合、ダイアログ内でスクロール可能になります。
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>同意する</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * インタラクション例
 *
 * play関数を使用して、自動的にダイアログを開くテスト。
 */
export const WithInteraction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>インタラクションテスト</DialogTitle>
          <DialogDescription>このストーリーでは自動的にダイアログが開きます。</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">play関数により自動的にダイアログが開かれます。</p>
        </div>
        <DialogFooter>
          <Button data-testid="close-button">閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // トリガーボタンをクリック
    const triggerButton = canvas.getByRole("button", { name: /ダイアログを開く/i });
    await userEvent.click(triggerButton);

    // ダイアログが開いたことを確認（Portalでレンダリングされるためdocument.bodyから検索）
    const dialog = await within(document.body).findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // タイトルが表示されていることを確認
    const title = within(dialog).getByText("インタラクションテスト");
    expect(title).toBeInTheDocument();
  },
};
