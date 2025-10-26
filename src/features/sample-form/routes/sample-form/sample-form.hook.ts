'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { sampleFormSchema, type SampleFormValues } from '../../schemas/sample-form.schema';

/**
 * サンプルフォームページのカスタムフック
 *
 * フォームの状態管理とロジックを担当します。
 */
export const useSampleForm = () => {
  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
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
  const onSubmit = handleSubmit(async (data) => {
    // フォームデータを表示
    console.log('Form Data:', data);
    alert(`フォームが送信されました！\n\n${JSON.stringify(data, null, 2)}`);

    // フォームをリセット
    reset();
  });

  return {
    control,
    onSubmit,
    errors,
    reset,
  };
};
