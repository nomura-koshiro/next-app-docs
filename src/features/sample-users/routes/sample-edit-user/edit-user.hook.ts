'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useUpdateUser } from '@/features/sample-users';
import { useUser } from '@/features/sample-users/api/get-user';
import { userFormSchema, type UserFormValues } from '@/features/sample-users/schemas/user-form.schema';
import type { Role } from '@/schemas/fields/role.schema';

/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 *
 * API層のuseUserを呼び出し、フォーム処理とナビゲーションを追加
 */
export const useEditUser = (userId: string) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();

  // useSuspenseQueryなので、データ取得完了まで待機される
  // つまり、ここでは必ずdataが存在する
  const { data } = useUser({ userId });

  const updateUserMutation = useUpdateUser();

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
    // useSuspenseQueryなので最初からdataが存在し、useEffectが不要
    defaultValues: {
      name: data.data.name,
      email: data.data.email,
      role: data.data.role as Role,
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * フォーム送信ハンドラー
   *
   * 処理フロー:
   * 1. FastAPIにユーザー更新リクエスト送信
   * 2. 成功時: ユーザー一覧ページへ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (formData: UserFormValues) => {
    await updateUserMutation
      .mutateAsync({
        userId,
        data: formData,
      })
      .then(() => {
        router.push('/sample-users');
      })
      .catch(() => {
        setError('root', {
          message: 'ユーザーの更新に失敗しました',
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
    isSubmitting: updateUserMutation.isPending,
  };
};
