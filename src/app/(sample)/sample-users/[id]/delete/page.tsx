import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザー削除 | Sample App',
  description: 'ユーザー情報を削除します。',
};

export { default } from '@/features/sample-users/routes/sample-delete-user';
