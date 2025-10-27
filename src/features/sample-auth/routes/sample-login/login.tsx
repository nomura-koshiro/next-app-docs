'use client';

import { useDevTools } from '@/hooks/use-devtools';

import { LoginForm } from './components/login';
import { useLogin } from './login.hook';

/**
 * ログインページ
 */
export default function LoginPage() {
  // ================================================================================
  // フック
  // ================================================================================
  const { control, onSubmit, errors, isSubmitting } = useLogin();
  const DevTools = useDevTools(control);

  return (
    <>
      <LoginForm control={control} onSubmit={onSubmit} errors={errors} isSubmitting={isSubmitting} />
      {DevTools}
    </>
  );
}
