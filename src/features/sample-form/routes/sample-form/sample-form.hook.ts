'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { sampleFormSchema, type SampleFormValues } from '../../schemas/sample-form.schema';

/**
 * サンプルフォームページのカスタムフック
 *
 * フォームの状態管理とロジックを担当します。
 * react-hook-formとzodスキーマによるバリデーションを使用し、
 * ユーザー入力を検証してから送信処理を実行します。
 *
 * @returns フォームの状態と操作関数
 * @returns control - react-hook-formのcontrolオブジェクト
 * @returns onSubmit - フォーム送信ハンドラー
 * @returns errors - バリデーションエラー
 * @returns reset - フォームリセット関数
 * @returns isSubmitting - 送信中フラグ
 *
 * @example
 * ```tsx
 * const { control, onSubmit, errors, isSubmitting } = useSampleForm()
 *
 * <form onSubmit={onSubmit}>
 *   <Controller name="username" control={control} />
 *   {errors.username && <span>{errors.username.message}</span>}
 *   <button disabled={isSubmitting}>送信</button>
 * </form>
 * ```
 */
export const useSampleForm = () => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      username: '',
      email: '',
      age: '',
      country: '',
      bio: '',
      terms: false,
      newsletter: false,
      gender: 'male',
      notifications: true,
      darkMode: false,
      birthdate: '',
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  /**
   * フォーム送信ハンドラー
   *
   * 処理フロー:
   * 1. フォームデータをバリデーション
   * 2. コンソールに送信データを出力
   * 3. アラートで送信完了を通知
   * 4. フォームをリセット
   */
  const onSubmit = handleSubmit(async (data) => {
    // Formデータを表示
    console.log('フォームデータ:', data);
    alert(`フォームが送信されました！\n\n${JSON.stringify(data, null, 2)}`);

    // Formをリセット
    reset();
  });

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    control,
    onSubmit,
    errors,
    reset,
    isSubmitting,
  };
};
