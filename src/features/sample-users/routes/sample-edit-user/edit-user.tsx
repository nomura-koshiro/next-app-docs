"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/sample-users/components/user-form";
import { useEditUser } from "./edit-user.hook";

/**
 * ユーザー編集ページ
 */
export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {
    userId,
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting,
    isLoading,
    error,
  } = useEditUser(params);

  if (isLoading || userId === null) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return (
      <ErrorMessage message="ユーザーの読み込みに失敗しました" fullScreen />
    );
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="ユーザー情報編集"
        description="ユーザーの情報を編集してください"
      />

      <UserForm
        control={control}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        errors={errors}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    </PageLayout>
  );
}
