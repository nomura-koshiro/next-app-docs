import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/sample-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sample-ui/card";

import {
  ControlledCheckboxField,
  ControlledDateField,
  ControlledInputField,
  ControlledRadioGroupField,
  ControlledSelectField,
  ControlledSwitchField,
  ControlledTextareaField,
} from "./controlled-form-field";

/**
 * ControlledFormFieldsコンポーネントのストーリー
 *
 * React Hook FormとZodを統合した制御されたフォームフィールドコンポーネント群。
 * バリデーションとエラー処理が自動的に行われます。
 *
 * @example
 * ```tsx
 * const { control } = useForm({ resolver: zodResolver(schema) });
 * <ControlledInputField control={control} name="username" label="ユーザー名" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/sample-ui/ControlledFormFields",

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
          "React Hook Formによって制御されるフォームフィールドコンポーネント群。Zodスキーマによるバリデーションと統合されています。\n\n" +
          "**主な機能:**\n" +
          "- React Hook Formとの統合\n" +
          "- Zodによる型安全なバリデーション\n" +
          "- 自動エラー表示\n" +
          "- 豊富なフィールドタイプ（Input, Select, Textarea, Checkbox, RadioGroup, Switch, Date）\n\n" +
          "**使用場面:**\n" +
          "- 複雑なバリデーションが必要なフォーム\n" +
          "- 型安全性が重要なフォーム\n" +
          "- ユーザー登録・編集フォーム\n" +
          "- 設定画面",
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
} satisfies Meta;

export default meta;

/**
 * ControlledInputField のサンプル
 */
export const InputField: StoryObj = {
  name: "入力フィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御される入力フィールド。Zodスキーマによるバリデーションが自動的に適用されます。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      username: z.string().min(3, { message: "3文字以上で入力してください" }),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { username: "" },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledInputField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledInputField control={control} name="username" label="ユーザー名" placeholder="yamada_taro" required />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledSelectField のサンプル
 */
export const SelectField: StoryObj = {
  name: "セレクトフィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御されるセレクトフィールド。選択肢から1つを選ぶ入力に使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      country: z.string().min(1, { message: "国を選択してください" }),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { country: "" },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledSelectField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledSelectField
              control={control}
              name="country"
              label="国"
              options={[
                { value: "jp", label: "日本" },
                { value: "us", label: "アメリカ" },
                { value: "uk", label: "イギリス" },
                { value: "cn", label: "中国" },
              ]}
              required
            />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledTextareaField のサンプル
 */
export const TextareaField: StoryObj = {
  name: "テキストエリアフィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御される複数行テキスト入力フィールド。長文の入力に使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      bio: z.string().min(10, { message: "10文字以上で入力してください" }).max(200, { message: "200文字以内で入力してください" }),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { bio: "" },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledTextareaField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledTextareaField
              control={control}
              name="bio"
              label="自己紹介"
              placeholder="あなたの自己紹介を入力してください..."
              rows={5}
              required
            />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledCheckboxField のサンプル
 */
export const CheckboxField: StoryObj = {
  name: "チェックボックスフィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御されるチェックボックスフィールド。利用規約への同意などに使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      terms: z.boolean().refine((val) => val === true, {
        message: "利用規約に同意する必要があります",
      }),
      newsletter: z.boolean().optional(),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { terms: false, newsletter: false },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledCheckboxField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledCheckboxField
              control={control}
              name="terms"
              label="利用規約に同意する"
              description="このサービスの利用規約とプライバシーポリシーに同意します"
            />
            <ControlledCheckboxField
              control={control}
              name="newsletter"
              label="ニュースレターを受け取る"
              description="新機能やアップデート情報をメールで受け取ります（任意）"
            />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledRadioGroupField のサンプル
 */
export const RadioGroupField: StoryObj = {
  name: "ラジオグループフィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御されるラジオボタングループ。複数の選択肢から1つを選ぶ入力に使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      gender: z.enum(["male", "female", "other"], {
        message: "性別を選択してください",
      }),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { gender: "male" as const },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledRadioGroupField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledRadioGroupField
              control={control}
              name="gender"
              label="性別"
              options={[
                { value: "male", label: "男性" },
                { value: "female", label: "女性" },
                {
                  value: "other",
                  label: "その他",
                  description: "回答したくない、または別の性別",
                },
              ]}
              required
            />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledSwitchField のサンプル
 */
export const SwitchField: StoryObj = {
  name: "スイッチフィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御されるスイッチフィールド。オン/オフの設定に使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      notifications: z.boolean(),
      darkMode: z.boolean(),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { notifications: true, darkMode: false },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledSwitchField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledSwitchField
              control={control}
              name="notifications"
              label="通知を有効にする"
              description="重要なお知らせをプッシュ通知で受け取ります"
            />
            <ControlledSwitchField control={control} name="darkMode" label="ダークモード" description="ダークモードでUIを表示します" />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * ControlledDateField のサンプル
 */
export const DateField: StoryObj = {
  name: "日付フィールド",
  parameters: {
    docs: {
      description: {
        story: "React Hook Formで制御される日付入力フィールド。生年月日などの入力に使用します。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      birthdate: z.string().min(1, { message: "生年月日を入力してください" }),
    });

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { birthdate: "" },
    });

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ControlledDateField</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
            <ControlledDateField control={control} name="birthdate" label="生年月日" required />
            <Button type="submit" className="w-full">
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  },
};

/**
 * すべてのフィールドを組み合わせた総合サンプル
 */
export const CompleteForm: StoryObj = {
  name: "完全なフォーム",
  parameters: {
    docs: {
      description: {
        story:
          "すべてのControlledフィールドコンポーネントを組み合わせた実用的なフォームの例。React Hook FormとZodによる包括的なバリデーションが実装されています。",
      },
    },
  },
  render: () => {
    const schema = z.object({
      username: z.string().min(3, { message: "3文字以上で入力してください" }),
      email: z.string().min(1, { message: "メールアドレスは必須です" }).email({ message: "有効なメールアドレスを入力してください" }),
      country: z.string().min(1, { message: "国を選択してください" }),
      bio: z.string().min(10, { message: "10文字以上で入力してください" }),
      terms: z.boolean().refine((val) => val === true, {
        message: "利用規約に同意する必要があります",
      }),
      gender: z.enum(["male", "female", "other"], {
        message: "性別を選択してください",
      }),
      notifications: z.boolean(),
      birthdate: z.string().min(1, { message: "生年月日を入力してください" }),
    });

    const { control, handleSubmit, reset } = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        username: "",
        email: "",
        country: "",
        bio: "",
        terms: false,
        gender: "male" as const,
        notifications: true,
        birthdate: "",
      },
    });

    return (
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>完全なフォームの例</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => {
              alert(JSON.stringify(data, null, 2));
              reset();
            })}
            className="space-y-6"
          >
            <ControlledInputField control={control} name="username" label="ユーザー名" placeholder="yamada_taro" required />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
              required
            />

            <ControlledSelectField
              control={control}
              name="country"
              label="国"
              options={[
                { value: "jp", label: "日本" },
                { value: "us", label: "アメリカ" },
                { value: "uk", label: "イギリス" },
                { value: "cn", label: "中国" },
              ]}
              required
            />

            <ControlledTextareaField
              control={control}
              name="bio"
              label="自己紹介"
              placeholder="あなたの自己紹介を入力してください..."
              rows={4}
              required
            />

            <ControlledCheckboxField
              control={control}
              name="terms"
              label="利用規約に同意する"
              description="このサービスの利用規約とプライバシーポリシーに同意します"
            />

            <ControlledRadioGroupField
              control={control}
              name="gender"
              label="性別"
              options={[
                { value: "male", label: "男性" },
                { value: "female", label: "女性" },
                {
                  value: "other",
                  label: "その他",
                  description: "回答したくない、または別の性別",
                },
              ]}
              required
            />

            <ControlledSwitchField
              control={control}
              name="notifications"
              label="通知を有効にする"
              description="重要なお知らせをプッシュ通知で受け取ります"
            />

            <ControlledDateField control={control} name="birthdate" label="生年月日" required />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                送信
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} className="flex-1">
                リセット
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  },
};
