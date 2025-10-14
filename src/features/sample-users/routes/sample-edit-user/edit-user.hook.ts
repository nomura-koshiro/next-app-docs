import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateUser } from "@/features/sample-users";
import { useUser } from "@/features/sample-users/api/get-user";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/sample-users/schemas/user-form.schema";

/**
 * ユーザー編集ページのロジックを管理するカスタムフック
 *
 * API層のuseUserを呼び出し、フォーム処理とナビゲーションを追加
 */
export const useEditUser = (params: Promise<{ id: string }>) => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const { id: userId } = use(params);

  const { data } = useUser({ userId });

  const updateUserMutation = useUpdateUser();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

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

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((formData: UserFormValues) => {
    updateUserMutation
      .mutateAsync({
        userId,
        data: formData,
      })
      .then(() => {
        router.push("/sample-users");
      })
      .catch(() => {
        setError("root", {
          message: "ユーザーの更新に失敗しました",
        });
      });
  });

  const handleCancel = () => {
    router.push("/sample-users");
  };

  return {
    control,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting: updateUserMutation.isPending,
  };
};
