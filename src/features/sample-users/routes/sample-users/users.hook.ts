import { useRouter } from "next/navigation";
import { useUsers as useUsersQuery } from "@/features/sample-users";

/**
 * ユーザー一覧ページのロジックを管理するカスタムフック
 */
export const useUsers = () => {
  const router = useRouter();
  const { data, isLoading, error } = useUsersQuery();

  const users = data?.data ?? [];

  const handleEdit = (userId: string) => {
    router.push(`/users/${userId}/edit`);
  };

  const handleDelete = (userId: string) => {
    router.push(`/users/${userId}/delete`);
  };

  const handleCreateNew = () => {
    router.push("/users/new");
  };

  return {
    users,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleCreateNew,
  };
};
