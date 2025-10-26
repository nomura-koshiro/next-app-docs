import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/sample-ui/alert';
import { Button } from '@/components/sample-ui/button';
import { Card, CardContent } from '@/components/sample-ui/card';
import type { User } from '@/features/sample-users/types';

type DeleteUserConfirmationProps = {
  /** 削除対象のユーザー */
  user: User;
  /** 削除ボタンのクリックハンドラー */
  onDelete: () => void;
  /** キャンセルボタンのクリックハンドラー */
  onCancel: () => void;
  /** 削除中かどうか */
  isDeleting: boolean;
};

/**
 * ユーザー削除確認コンポーネント（プレゼンテーション）
 *
 * ユーザー削除の確認画面を表示します。
 * ロジックは含まず、純粋な表示とイベント通知のみを行います。
 *
 * 機能:
 * - 削除対象ユーザーの情報表示（ID、名前、メール、ロール）
 * - 警告メッセージ表示
 * - 削除・キャンセルボタン
 * - 削除中の状態表示
 *
 * @param props - DeleteUserConfirmationコンポーネントのプロパティ
 * @returns ユーザー削除確認要素
 */
export const DeleteUserConfirmation = ({ user, onDelete, onCancel, isDeleting }: DeleteUserConfirmationProps) => {
  return (
    <Card className="border-red-200">
      <CardContent className="pt-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>削除対象のユーザー情報</AlertTitle>
          <AlertDescription>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 font-medium">ID:</span>
                <span>{user.id}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">名前:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">メールアドレス:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">ロール:</span>
                <span>{user.role}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting} className="flex-1">
            {isDeleting ? '削除中...' : '削除する'}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isDeleting} className="flex-1">
            キャンセル
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
