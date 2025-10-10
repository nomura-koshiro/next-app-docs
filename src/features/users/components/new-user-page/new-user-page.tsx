"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/features/users";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/users/schemas/user-form.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ControlledInputField,
  ControlledSelectField,
} from "@/components/ui/form-field/controlled-form-field";
import { ErrorMessage } from "@/components/ui/error-message";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";

export default function NewUserPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors: _errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        router.push("/users");
      },
    },
  });

  const onSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data);
  };

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="新規ユーザー作成"
        description="新しいユーザーの情報を入力してください"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ControlledInputField
              control={control}
              name="name"
              label="名前"
              placeholder="山田太郎"
              required
            />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
              placeholder="yamada@example.com"
              required
            />

            <ControlledSelectField
              control={control}
              name="role"
              label="ロール"
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
