"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { UsersList } from "./components/users-list";
import { useUsers } from "./users.hook";

/**
 * ユーザー一覧ページ（Client Component）
 *
 * TanStack Queryでデータフェッチを行います。
 */
export default function UsersPage() {
  // ================================================================================
  // Hooks
  // ================================================================================
  const { users, isLoading, error, handleEdit, handleDelete, handleCreateNew } =
    useUsers();

  // ================================================================================
  // Conditional Rendering
  // ================================================================================
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return <ErrorMessage message="エラーが発生しました" fullScreen />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="ユーザー一覧"
        action={<Button onClick={handleCreateNew}>新規ユーザー作成</Button>}
      />

      <UsersList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </PageLayout>
  );
}
