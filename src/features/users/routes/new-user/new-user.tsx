"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/users/components/user-form";
import { useNewUser } from "./new-user.hook";

/**
 * 新規ユーザー作成ページ
 */
export default function NewUserPage() {
  const { control, onSubmit, handleCancel, errors, isSubmitting } =
    useNewUser();

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="新規ユーザー作成"
        description="新しいユーザーの情報を入力してください"
      />

      <UserForm
        control={control}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </PageLayout>
  );
}
