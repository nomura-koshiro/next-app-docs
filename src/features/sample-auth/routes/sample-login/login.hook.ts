'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useLogin as useLoginMutation } from '@/features/sample-auth/api/login';
import { loginFormSchema, type LoginFormValues } from '@/features/sample-auth/schemas/login-form.schema';
import { useAuthStore } from '@/features/sample-auth/stores/auth-store';

/**
 * ログインページのロジックを管理するカスタムフック
 */
export const useLogin = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useLoginMutation();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * ログイン送信ハンドラー
   *
   * 処理フロー:
   * 1. FastAPIにログインリクエスト送信
   * 2. 成功時:
   *    - トークンをlocalStorageに保存
   *    - ユーザー情報をZustandストアに保存
   *    - ユーザー一覧ページへ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (values: LoginFormValues) => {
    await loginMutation
      .mutateAsync(values)
      .then((data) => {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/users');
      })
      .catch(() => {
        setError('root', {
          message: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
        });
      });
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending,
  };
};
