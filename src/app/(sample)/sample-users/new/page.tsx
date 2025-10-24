import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新規ユーザー作成 | Sample App',
  description: '新しいユーザーを作成します。',
};

export { default } from '@/features/sample-users/routes/sample-new-user';
