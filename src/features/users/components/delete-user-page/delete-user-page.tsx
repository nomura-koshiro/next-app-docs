"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useDeleteUser } from "@/features/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { AlertTriangle } from "lucide-react";

export default function DeleteUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params
      .then((resolvedParams) => {
        setUserId(resolvedParams.id);
      })
      .catch((error: unknown) => {
        console.error("Failed to resolve params:", error);
      });
  }, [params]);

  const { data, isLoading, error } = useUser({
    userId: userId ?? "",
    queryConfig: {
      enabled: userId !== null,
    },
  });

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        router.push("/users");
      },
    },
  });

  const handleDelete = () => {
    if (userId === null) {
      return;
    }

    deleteUserMutation.mutate(userId);
  };

  if (isLoading || userId === null) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return (
      <ErrorMessage message="ユーザーの読み込みに失敗しました" fullScreen />
    );
  }

  const user = data?.data;

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="ユーザー削除"
        description="本当に削除してもよろしいですか?この操作は取り消せません。"
      />

      <Card className="border-red-200">
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>削除対象のユーザー情報</AlertTitle>
            <AlertDescription>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex">
                  <span className="w-32 font-medium">ID:</span>
                  <span>{user?.id}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">名前:</span>
                  <span>{user?.name}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">メールアドレス:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">ロール:</span>
                  <span>{user?.role}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {deleteUserMutation.isError && (
            <div className="mb-6">
              <ErrorMessage message="ユーザーの削除に失敗しました" />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteUserMutation.isPending}
              className="flex-1"
            >
              {deleteUserMutation.isPending ? "削除中..." : "削除する"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/users")}
              className="flex-1"
            >
              キャンセル
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
