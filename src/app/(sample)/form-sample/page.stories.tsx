import type { Meta, StoryObj } from "@storybook/nextjs";
import FormSamplePage from "./page";

const meta = {
  title: "Pages/FormSample",
  component: FormSamplePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "react-hook-form + zod を使った全フォームコンポーネントの総合サンプルページ。若手開発者が参照できるように、すべてのフォーム部品の使用例とバリデーションを含んでいます。",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormSamplePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * フォーム部品サンプルページ
 *
 * このページには以下のフォームコンポーネントが含まれています：
 * - ControlledInputField（テキスト、メール、数値）
 * - ControlledSelectField（国選択）
 * - ControlledTextareaField（自己紹介）
 * - ControlledCheckboxField（利用規約、ニュースレター）
 * - ControlledRadioGroupField（性別選択）
 * - ControlledSwitchField（通知、ダークモード）
 * - ControlledDateField（生年月日）
 *
 * すべてのフィールドにzodによるバリデーションが設定されています。
 */
export const Default: Story = {};

/**
 * フォーム送信の動作確認
 *
 * 各フィールドに正しい値を入力して「送信」ボタンをクリックすると、
 * アラートでフォームデータが表示されます。
 * バリデーションエラーがある場合は、エラーメッセージが表示されます。
 */
export const WithValidation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "すべてのフィールドに適切なバリデーションが設定されています。フォームを送信する前に、各フィールドの検証ルールを確認できます。",
      },
    },
  },
};

/**
 * フォームリセット機能
 *
 * 「リセット」ボタンをクリックすると、すべてのフィールドが初期値に戻ります。
 */
export const ResetForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "フォームの「リセット」ボタンは、react-hook-formのreset()メソッドを使用して全フィールドをデフォルト値に戻します。",
      },
    },
  },
};
