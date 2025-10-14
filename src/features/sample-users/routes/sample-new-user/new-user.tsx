"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/sample-users/components/user-form";
import { useNewUser } from "./new-user.hook";
import { useDevTools } from "@/hooks/use-devtools";

/**
 * 新規ユーザー作成ページ
 */
export default function NewUserPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { control, onSubmit, handleCancel, errors, isSubmitting } =
    useNewUser();
  const DevTools = useDevTools(control);

  return (
    <>
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
      {DevTools}
    </>
  );
}
