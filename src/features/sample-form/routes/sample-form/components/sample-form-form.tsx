import { Control } from "react-hook-form";

import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/sample-ui/card";
import {
  ControlledCheckboxField,
  ControlledDateField,
  ControlledInputField,
  ControlledRadioGroupField,
  ControlledSelectField,
  ControlledSwitchField,
  ControlledTextareaField,
} from "@/components/sample-ui/form-field/controlled-form-field";

import type { SampleFormValues } from "../../../types/forms";

type SampleFormProps = {
  /** React Hook Formのcontrolオブジェクト */
  control: Control<SampleFormValues>;
  /** フォーム送信ハンドラー */
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  /** フォームリセットハンドラー */
  onReset: () => void;
  /** 送信中かどうか */
  isSubmitting: boolean;
};

/**
 * サンプルフォームページコンポーネント（プレゼンテーション）
 *
 * すべてのフォーム部品の使用例を表示します。
 * ロジックは含まず、純粋な表示とイベント通知のみを行います。
 */
export const SampleForm = ({ control, onSubmit, onReset, isSubmitting }: SampleFormProps) => {
  return (
    <PageLayout maxWidth="4xl">
      <PageHeader title="フォーム部品サンプル" description="react-hook-form + zod を使ったすべてのフォーム部品の使用例" />

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Input Fields */}
        <Card>
          <CardHeader>
            <CardTitle>テキスト入力フィールド</CardTitle>
            <CardDescription>ControlledInputField を使った各種テキスト入力</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ControlledInputField control={control} name="username" label="ユーザー名" placeholder="yamada_taro" required />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
              required
            />

            <ControlledInputField control={control} name="age" label="年齢" type="number" placeholder="25" required />
          </CardContent>
        </Card>

        {/* Select & Textarea */}
        <Card>
          <CardHeader>
            <CardTitle>選択 & 複数行入力</CardTitle>
            <CardDescription>Select と Textarea コンポーネントの使用例</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              rows={5}
              required
            />
          </CardContent>
        </Card>

        {/* Checkbox */}
        <Card>
          <CardHeader>
            <CardTitle>チェックボックス</CardTitle>
            <CardDescription>Checkbox コンポーネントの使用例</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        {/* Radio Group */}
        <Card>
          <CardHeader>
            <CardTitle>ラジオボタン</CardTitle>
            <CardDescription>RadioGroup コンポーネントの使用例</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Switch */}
        <Card>
          <CardHeader>
            <CardTitle>スイッチ</CardTitle>
            <CardDescription>Switch コンポーネントの使用例</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ControlledSwitchField
              control={control}
              name="notifications"
              label="通知を有効にする"
              description="重要なお知らせをプッシュ通知で受け取ります"
            />

            <ControlledSwitchField control={control} name="darkMode" label="ダークモード" description="ダークモードでUIを表示します" />
          </CardContent>
        </Card>

        {/* Date */}
        <Card>
          <CardHeader>
            <CardTitle>日付入力</CardTitle>
            <CardDescription>Date Input コンポーネントの使用例</CardDescription>
          </CardHeader>
          <CardContent>
            <ControlledDateField control={control} name="birthdate" label="生年月日" required />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "送信中..." : "送信"}
          </Button>
          <Button type="button" variant="outline" onClick={onReset} className="flex-1">
            リセット
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};
