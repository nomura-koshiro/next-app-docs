"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MainErrorFallback } from "@/components/errors/main";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteUserConfirmation } from "./components/delete-user-confirmation";
import { useDeleteUser } from "./delete-user.hook";

/**
 * ユーザー削除確認ページのコンテンツ
 */
const DeleteUserPageContent = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { user, handleDelete, handleCancel, isDeleting } =
    useDeleteUser(params);

  if (!user) {
    return <ErrorMessage message="ユーザーが見つかりません" fullScreen />;
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="ユーザー削除"
        description="本当に削除してもよろしいですか?この操作は取り消せません。"
      />

      <DeleteUserConfirmation
        user={user}
        onDelete={handleDelete}
        onCancel={handleCancel}
        isDeleting={isDeleting}
      />
    </PageLayout>
  );
};

/**
 * ユーザー削除確認ページ
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 */
const DeleteUserPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <DeleteUserPageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DeleteUserPage;
