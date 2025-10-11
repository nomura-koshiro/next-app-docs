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

export const Default: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="message">メッセージ</Label>
      <Textarea id="message" placeholder="メッセージを入力してください..." />
    </div>
  ),
};

export const WithValue: Story = {
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

export const Disabled: Story = {
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

export const WithRows: Story = {
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

export const WithCharacterCount: Story = {
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

export const WithError: Story = {
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

export const FeedbackForm: Story = {
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
