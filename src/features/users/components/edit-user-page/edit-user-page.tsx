"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser } from "@/features/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

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

  const updateUserMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push("/users");
      },
    },
  });

  useEffect(() => {
    if (data?.data !== null && data?.data !== undefined) {
      setName(data.data.name);
      setEmail(data.data.email);
      setRole(data.data.role);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === null) {
      return;
    }

    updateUserMutation.mutate({
      userId,
      data: { name, email, role },
    });
  };

  if (isLoading || userId === null) {
    return <LoadingSpinner fullScreen />;
  }

  if (error !== null) {
    return (
      <ErrorMessage message="ユーザーの読み込みに失敗しました" fullScreen />
    );
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="ユーザー情報編集"
        description="ユーザーの情報を編集してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="名前"
              id="name"
              value={name}
              onChange={setName}
              required
            />

            <InputField
              label="メールアドレス"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            <SelectField
              label="ロール"
              id="role"
              value={role}
              onChange={setRole}
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
              required
            />

            {updateUserMutation.isError && (
              <ErrorMessage message="ユーザーの更新に失敗しました" />
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="flex-1"
              >
                {updateUserMutation.isPending ? "更新中..." : "更新"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
