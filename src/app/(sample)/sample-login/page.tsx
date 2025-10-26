import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン | Sample App',
  description: 'ログインページです。メールアドレスとパスワードでログインできます。',
};

export { default } from '@/features/sample-auth/routes/sample-login';
