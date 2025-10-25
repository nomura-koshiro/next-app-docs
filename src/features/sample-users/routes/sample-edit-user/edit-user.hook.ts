'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { use, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateUser } from '@/features/sample-users';
import { useUser } from '@/features/sample-users/api/get-user';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 *
 * React 19のuseフックとuseTransitionを使用して、
 * Promise型のparamsの解決とノンブロッキングなページ遷移を実現します。
 * API層のuseUserを呼び出し、フォーム処理とナビゲーションを追加
 */
export const useEditUser = (params: Promise<{ id: string }>) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { id: userId } = use(params);

  const { data } = useUser({ userId });

  const updateUserMutation = useUpdateUser();
  const [isPending, startTransition] = useTransition();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  // 取得したユーザーデータをフォームの初期値として設定
  useEffect(() => {
    if (data?.data !== null && data?.data !== undefined) {
      reset({
        name: data.data.name,
        email: data.data.email,
        role: data.data.role as 'user' | 'admin',
      });
    }
  }, [data, reset]);

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * フォーム送信ハンドラー（useTransition対応版）
   *
   * 処理フロー:
   * 1. FastAPIにユーザー更新リクエスト送信
   * 2. 成功時: useTransitionでノンブロッキングなページ遷移
   * 3. 遷移中もUIが応答性を保つ
   * 4. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (formData: UserFormValues) => {
    try {
      await updateUserMutation.mutateAsync({
        userId,
        data: formData,
      });

      // 🚀 Non-blocking navigation with useTransition
      startTransition(() => {
        router.push('/sample-users');
      });
    } catch (error) {
      setError('root', {
        message: 'ユーザーの更新に失敗しました',
      });
    }
  });

  const handleCancel = () => {
    // キャンセル時もuseTransitionを使用
    startTransition(() => {
      router.push('/sample-users');
    });
  };

  return {
    control,
    onSubmit,
    handleCancel,
    errors,
    // Mutationのpending と Transitionのpending を統合
    isSubmitting: updateUserMutation.isPending || isPending,
  };
};
