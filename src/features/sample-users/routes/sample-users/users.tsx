"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/sample-ui/button";
import { LoadingSpinner } from "@/components/sample-ui/loading-spinner";

import { UsersList } from "./components/users-list";
import { useUsers } from "./users.hook";

/**
 * ユーザー一覧ページのコンテンツ
 */
const UsersPageContent = () => {
  const { users, handleEdit, handleDelete, handleCreateNew } = useUsers();

  return (
    <PageLayout>
      <PageHeader title="ユーザー一覧" action={<Button onClick={handleCreateNew}>新規ユーザー作成</Button>} />

      <UsersList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </PageLayout>
  );
};

/**
 * ユーザー一覧ページ（Client Component）
 *
 * TanStack QueryのSuspense機能を使用してデータフェッチを行います。
 */
const UsersPage = () => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <UsersPageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default UsersPage;
