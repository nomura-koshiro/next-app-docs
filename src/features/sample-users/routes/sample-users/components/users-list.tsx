import { Button } from '@/components/sample-ui/button';
import { User } from '@/features/sample-users/types';

type UsersListProps = {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
};

/**
 * ユーザー一覧テーブルコンポーネント
 */
export const UsersList = ({ users, onEdit, onDelete }: UsersListProps) => {
  if (users.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="py-12 text-center text-gray-500">ユーザーが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">名前</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">メールアドレス</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ロール</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.id}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.createdAt}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user.id)}>
                    編集
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                    削除
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
