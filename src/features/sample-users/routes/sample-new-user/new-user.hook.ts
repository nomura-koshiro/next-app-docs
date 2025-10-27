'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCreateUser } from '@/features/sample-users';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';

/**
 * 新規ユーザー作成ページのロジックを管理するカスタムフック
 */
export const useNewUser = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const createUserMutation = useCreateUser();

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
   * フォーム送信ハンドラー
   *
   * 処理フロー:
   * 1. FastAPIにユーザー作成リクエスト送信
   * 2. 成功時: ユーザー一覧ページへ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (data: UserFormValues) => {
    await createUserMutation
      .mutateAsync(data)
      .then(() => {
        router.push('/sample-users');
      })
      .catch(() => {
        setError('root', {
          message: 'ユーザーの作成に失敗しました',
        });
      });
  });

  const handleCancel = () => {
    router.push('/sample-users');
  };

  return {
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting: createUserMutation.isPending,
  };
};
