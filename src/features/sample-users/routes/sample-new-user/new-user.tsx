'use client';

import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { UserForm } from '@/features/sample-users/components/user-form';
import { useDevTools } from '@/hooks/use-devtools';

import { useNewUser } from './new-user.hook';

/**
 * 新規ユーザー作成ページ
 */
export default function NewUserPage() {
  // ================================================================================
  // フック
  // ================================================================================
  const { control, onSubmit, handleCancel, errors, isSubmitting } = useNewUser();
  const DevTools = useDevTools(control);

  return (
    <>
      <PageLayout maxWidth="2xl">
        <PageHeader title="新規ユーザー作成" description="新しいユーザーの情報を入力してください" />

        <UserForm control={control} onSubmit={onSubmit} onCancel={handleCancel} errors={errors} isSubmitting={isSubmitting} />
      </PageLayout>
      {DevTools}
    </>
  );
}
