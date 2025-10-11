import { Control, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControlledInputField } from "@/components/ui/form-field/controlled-form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoginFormValues } from "@/features/sample-auth/schemas/login-form.schema";

type LoginFormProps = {
  /** React Hook Formのcontrolオブジェクト */
  control: Control<LoginFormValues>;
  /** フォーム送信ハンドラー */
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  /** フォームエラー */
  errors: FieldErrors<LoginFormValues>;
  /** ログイン中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
};

/**
 * ログインフォームコンポーネント（プレゼンテーション）
 *
 * ログインフォームの表示を担当します。
 * ロジックは含まず、純粋な表示とイベント通知のみを行います。
 *
 * 機能:
 * - メールアドレス入力フィールド
 * - パスワード入力フィールド
 * - エラーメッセージ表示
 * - ログインボタン
 * - ローディング状態の表示
 *
 * @param props - LoginFormコンポーネントのプロパティ
 * @returns ログインフォーム要素
 */
export const LoginForm = ({
  control,
  onSubmit,
  errors: _errors,
  isLoading,
  error,
}: LoginFormProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>サンプルアプリケーションへようこそ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <ControlledInputField
                control={control}
                name="email"
                label="メールアドレス"
                type="email"
                placeholder="user@example.com"
                required
              />

              <ControlledInputField
                control={control}
                name="password"
                label="パスワード"
                type="password"
                placeholder="パスワードを入力"
                required
              />
            </div>

            {error && <ErrorMessage message={error} />}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              テスト用アカウント: 任意のメールアドレスとパスワード
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
