'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateUser } from '@/features/sample-users';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

/**
 * 新規ユーザー作成ページのロジックを管理するカスタムフック
 *
 * React 19のuseTransitionを使用して、ページ遷移をノンブロッキングにします。
 * フォーム送信後のナビゲーション中もUIが応答性を保ちます。
 */
export const useNewUser = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const [isPending, startTransition] = useTransition();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
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

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * フォーム送信ハンドラー（useTransition対応版）
   *
   * 処理フロー:
   * 1. FastAPIにユーザー作成リクエスト送信
   * 2. 成功時: useTransitionでノンブロッキングなページ遷移
   * 3. 遷移中もUIが応答性を保つ
   * 4. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (data: UserFormValues) => {
    try {
      await createUserMutation.mutateAsync(data);

      // 🚀 Non-blocking navigation with useTransition
      // ページ遷移中もUIが応答性を保ち、ユーザーがブロックされない
      startTransition(() => {
        router.push('/sample-users');
      });
    } catch (error) {
      // エラー時の処理
      setError('root', {
        message: 'ユーザーの作成に失敗しました',
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
    isSubmitting: createUserMutation.isPending || isPending,
  };
};
