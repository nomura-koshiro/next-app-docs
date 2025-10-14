"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MainErrorFallback } from "@/components/errors/main";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/sample-users/components/user-form";
import { useEditUser } from "./edit-user.hook";

// 開発環境でのみReact Hook Form DevToolsをインポート
let DevTool: any = () => null;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DevTool = require("@hookform/devtools").DevTool;
}

/**
 * ユーザー編集ページのコンテンツ
 */
const EditUserPageContent = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { control, onSubmit, handleCancel, errors, isSubmitting } =
    useEditUser(params);

  return (
    <>
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

      {/* 開発環境でのみReact Hook Form DevToolsを表示 */}
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  );
};

/**
 * ユーザー編集ページ
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 */
const EditUserPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <EditUserPageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default EditUserPage;
