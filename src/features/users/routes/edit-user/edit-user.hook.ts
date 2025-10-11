import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useUpdateUser } from "@/features/users";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/users/schemas/user-form.schema";

/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 */
export const useEditUser = (params: Promise<{ id: string }>) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  // Next.js 15のApp Routerではparamsが非同期Promiseになる
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

  const updateUserMutation = useUpdateUser();

  // 取得したユーザーデータをフォームの初期値として設定
  useEffect(() => {
    if (data?.data !== null && data?.data !== undefined) {
      reset({
        name: data.data.name,
        email: data.data.email,
        role: data.data.role as "user" | "admin",
      });
    }
  }, [data, reset]);

  const onSubmit = handleSubmit((formData) => {
    if (userId === null) {
      return;
    }

    updateUserMutation
      .mutateAsync({
        userId,
        data: formData,
      })
      .then(() => {
        router.push("/users");
      })
      .catch(() => {
        setError("root", {
          message: "ユーザーの更新に失敗しました",
        });
      });
  });

  const handleCancel = () => {
    router.push("/users");
  };

  return {
    userId,
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting,
    isLoading,
    error,
  };
};
