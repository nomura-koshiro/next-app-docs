"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { UsersList } from "./components/users-list";
import { useUsers } from "./users.hook";

/**
 * ユーザー一覧ページ（Client Component）
 *
 * TanStack Queryでデータフェッチを行います。
 */
export default function UsersPage() {
  const { users, isLoading, error, handleEdit, handleDelete, handleCreateNew } =
    useUsers();

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
