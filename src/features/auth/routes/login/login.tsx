// ================================================================================
// Imports
// ================================================================================

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/sample-ui/button/button';
import { LoadingSpinner } from '@/components/ui';

import { useAuth } from '../../hooks/use-auth';

// ================================================================================
// コンポーネント
// ================================================================================

/**
 * ログインページ（Client Component）
 *
 * Azure Entra ID認証を使用したログインページ。
 * 開発モードではモックユーザーで即座にログイン、本番モードではAzure Entra IDの認証ページにリダイレクトします。
 *
 * 機能:
 * - Microsoftアカウントでのログイン
 * - 認証済みユーザーの自動リダイレクト
 * - ローディング状態の表示
 *
 * @returns ログインページ要素
 */
const LoginPage = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ================================================================================
  // Effects
  // ================================================================================
  // 認証済みユーザーはホームページにリダイレクト
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // ================================================================================
  // Handlers
  // ================================================================================
  const handleLogin = () => {
    login();
  };

  // ================================================================================
  // Render
  // ================================================================================
  // ローディング中または認証済みの場合はローディング表示
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner message="読み込み中..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="text-sm text-gray-600">Azure Entra IDアカウントでログインしてください</p>
        </div>
        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full" size="lg">
            Microsoftアカウントでログイン
          </Button>
          <p className="text-center text-xs text-gray-500">開発モードでは自動的にモックユーザーでログインします</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
