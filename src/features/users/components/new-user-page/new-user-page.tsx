"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/features/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push("/users");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({ name, email, role });
  };

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="新規ユーザー作成"
        description="新しいユーザーの情報を入力してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="名前"
              id="name"
              value={name}
              onChange={setName}
              placeholder="山田太郎"
              required
            />

            <InputField
              label="メールアドレス"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="yamada@example.com"
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

            {createUserMutation.isError && (
              <ErrorMessage message="ユーザーの作成に失敗しました" />
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex-1"
              >
                {createUserMutation.isPending ? "作成中..." : "作成"}
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
