'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useLogin as useLoginMutation } from '@/features/sample-auth/api/login';
import { loginFormSchema, type LoginFormValues } from '@/features/sample-auth/schemas/login-form.schema';
import { useAuthStore } from '@/features/sample-auth/stores/auth-store';

/**
 * ログインページのロジックを管理するカスタムフック
 *
 * React 19のuseTransitionを使用して、ログイン後のページ遷移を
 * ノンブロッキングにします。
 */
export const useLogin = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useLoginMutation();
  const [isPending, startTransition] = useTransition();

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
   * ログイン送信ハンドラー（useTransition対応版）
   *
   * 処理フロー:
   * 1. FastAPIにログインリクエスト送信
   * 2. 成功時:
   *    - トークンをlocalStorageに保存
   *    - ユーザー情報をZustandストアに保存
   *    - useTransitionでノンブロッキングなページ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await loginMutation.mutateAsync(values);

      localStorage.setItem('token', data.token);
      setUser(data.user);

      // 🚀 Non-blocking navigation with useTransition
      startTransition(() => {
        router.push('/users');
      });
    } catch (error) {
      setError('root', {
        message: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
      });
    }
  });

  return {
    control,
    onSubmit,
    errors,
    // Mutationのpending と Transitionのpending を統合
    isSubmitting: loginMutation.isPending || isPending,
  };
};
