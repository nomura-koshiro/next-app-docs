"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useUpdateUser } from "@/features/users";
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: _errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

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
      reset({
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: UserFormValues) => {
    if (userId === null) {
      return;
    }

    updateUserMutation.mutate({
      userId,
      data: formData,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ControlledInputField
              control={control}
              name="name"
              label="名前"
              required
            />

            <ControlledInputField
              control={control}
              name="email"
              label="メールアドレス"
              type="email"
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
