import { Control, FieldErrors } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Card, CardContent } from "@/components/sample-ui/card";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import { ControlledInputField, ControlledSelectField } from "@/components/sample-ui/form-field/controlled-form-field";
import { UserFormValues } from "@/features/sample-users/schemas/user-form.schema";

type UserFormProps = {
  /** React Hook Formのcontrolオブジェクト */
  control: Control<UserFormValues>;
  /** フォーム送信ハンドラー */
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  /** キャンセルボタンのクリックハンドラー */
  onCancel: () => void;
  /** フォームエラー */
  errors: FieldErrors<UserFormValues>;
  /** 送信中かどうか */
  isSubmitting: boolean;
  /** 編集モードかどうか（デフォルト: false） */
  isEditMode?: boolean;
};

/**
 * ユーザーフォームコンポーネント（プレゼンテーション）
 *
 * ユーザーの作成・編集に使用するフォームの表示を担当します。
 * ロジックは含まず、純粋な表示とイベント通知のみを行います。
 *
 * 機能:
 * - 名前入力フィールド
 * - メールアドレス入力フィールド
 * - ロール選択フィールド
 * - エラーメッセージ表示
 * - 送信・キャンセルボタン
 * - 作成/編集モードの切り替え（ボタンテキストの変更）
 *
 * @param props - UserFormコンポーネントのプロパティ
 * @returns ユーザーフォーム要素
 */
export const UserForm = ({ control, onSubmit, onCancel, errors, isSubmitting, isEditMode = false }: UserFormProps) => {
  // ================================================================================
  // 変数
  // ================================================================================
  const submitButtonText = isEditMode ? (isSubmitting ? "更新中..." : "更新") : isSubmitting ? "作成中..." : "作成";

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <ControlledInputField control={control} name="name" label="名前" placeholder="山田太郎" required />

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
            name="role"
            label="ロール"
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            required
          />

          {errors.root && <ErrorMessage message={errors.root.message ?? ""} />}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {submitButtonText}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
