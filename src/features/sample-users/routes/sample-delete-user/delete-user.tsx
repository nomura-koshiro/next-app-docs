'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { ErrorMessage } from '@/components/sample-ui/error-message';
import { LoadingSpinner } from '@/components/sample-ui/loading-spinner';

import { DeleteUserConfirmation } from './components/delete-user-confirmation';
import { useDeleteUser } from './delete-user.hook';

/**
 * ユーザー削除確認ページのコンテンツ (Client Component)
 */
const DeleteUserPageContent = () => {
  const params = useParams();
  const userId = params.id as string;

  const { user, handleDelete, handleCancel, isDeleting } = useDeleteUser(userId);

  if (user === undefined) {
    return <ErrorMessage message="ユーザーが見つかりません" fullScreen />;
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader title="ユーザー削除" description="本当に削除してもよろしいですか?この操作は取り消せません。" />

      <DeleteUserConfirmation user={user} onDelete={handleDelete} onCancel={handleCancel} isDeleting={isDeleting} />
    </PageLayout>
  );
};

/**
 * ユーザー削除確認ページ (Client Component)
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 */
const DeleteUserPage = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <DeleteUserPageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DeleteUserPage;
