import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Textarea } from "./textarea";
import { Label } from "@/components/ui/label";

const meta = {
  title: "components/ui/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのTextarea
 */
export const Default: Story = {
  name: "デフォルト",
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="message">メッセージ</Label>
      <Textarea id="message" placeholder="メッセージを入力してください..." />
    </div>
  ),
};

/**
 * 値が設定された状態
 */
export const WithValue: Story = {
  name: "値あり",
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="bio">自己紹介</Label>
      <Textarea
        id="bio"
        defaultValue="こんにちは！フロントエンドエンジニアとして働いています。React、TypeScript、Next.jsを使った開発が得意です。"
      />
    </div>
  ),
};

/**
 * 無効化された状態
 */
export const Disabled: Story = {
  name: "無効",
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="disabled">無効化されたテキストエリア</Label>
      <Textarea
        id="disabled"
        placeholder="入力できません..."
        disabled
        defaultValue="このテキストエリアは無効化されています"
      />
    </div>
  ),
};

/**
 * 行数を指定した状態
 */
export const WithRows: Story = {
  name: "行数指定",
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="rows">大きなテキストエリア（10行）</Label>
      <Textarea
        id="rows"
        rows={10}
        placeholder="長文を入力するための大きなテキストエリアです..."
      />
    </div>
  ),
};

/**
 * 文字数カウント付き
 */
export const WithCharacterCount: Story = {
  name: "文字数カウント付き",
  render: () => {
    const maxLength = 200;
    const [value, setValue] = React.useState("");

    return (
      <div className="w-[400px] space-y-2">
        <Label htmlFor="with-count">コメント</Label>
        <Textarea
          id="with-count"
          placeholder="コメントを入力してください..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength} 文字
        </p>
      </div>
    );
  },
};

/**
 * エラー状態
 */
export const WithError: Story = {
  name: "エラー",
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="error" className="text-destructive">
        コメント <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id="error"
        placeholder="10文字以上で入力してください..."
        defaultValue="短い"
        className="border-destructive"
        aria-invalid="true"
      />
      <p className="text-sm text-destructive">
        コメントは10文字以上で入力してください
      </p>
    </div>
  ),
};

/**
 * フィードバックフォームの例
 */
export const FeedbackForm: Story = {
  name: "フィードバックフォーム",
  render: () => (
    <div className="w-[500px] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedback">
          フィードバック <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="feedback"
          placeholder="サービスに関するご意見やご要望をお聞かせください..."
          rows={6}
        />
        <p className="text-sm text-muted-foreground">
          具体的なご意見をいただけると改善に役立ちます
        </p>
      </div>
    </div>
  ),
};
