import { useId } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

import { Button } from '@/components/sample-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/sample-ui/card';
import { ErrorMessage } from '@/components/sample-ui/error-message';
import { ControlledInputField } from '@/components/sample-ui/form-field/controlled-form-field';
import { LoginFormValues } from '@/features/sample-auth/schemas/login-form.schema';

type LoginFormProps = {
  /** React Hook Formのcontrolオブジェクト */
  control: Control<LoginFormValues>;
  /** フォーム送信ハンドラー */
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  /** フォームエラー */
  errors: FieldErrors<LoginFormValues>;
  /** ログイン中かどうか */
  isSubmitting: boolean;
  /** IDプレフィックス（Storybook等でIDを一意にする場合に使用） */
  idPrefix?: string;
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
export const LoginForm = ({ control, onSubmit, errors, isSubmitting, idPrefix = '' }: LoginFormProps) => {
  const uniqueId = useId();
  const emailId = idPrefix ? `${idPrefix}-email-${uniqueId}` : `email-${uniqueId}`;
  const passwordId = idPrefix ? `${idPrefix}-password-${uniqueId}` : `password-${uniqueId}`;

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
                autoComplete="email"
                id={emailId}
                required
              />

              <ControlledInputField
                control={control}
                name="password"
                label="パスワード"
                type="password"
                placeholder="パスワードを入力"
                autoComplete="current-password"
                id={passwordId}
                required
              />
            </div>

            {errors.root && <ErrorMessage message={errors.root.message ?? 'エラーが発生しました'} />}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'ログイン中...' : 'ログイン'}
            </Button>

            <p className="text-center text-sm text-gray-600">テスト用アカウント: 任意のメールアドレスとパスワード</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
