"use client";

import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteUserConfirmation } from "./components/delete-user-confirmation";
import { useDeleteUser } from "./delete-user.hook";

/**
 * ユーザー削除確認ページ
 */
export default function DeleteUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { user, isLoading, error, handleDelete, handleCancel, isDeleting } =
    useDeleteUser(params);

  // ================================================================================
  // Conditional Rendering
  // ================================================================================
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return (
      <ErrorMessage message="ユーザーの読み込みに失敗しました" fullScreen />
    );
  }

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
}
