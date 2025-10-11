import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/features/sample-users";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/sample-users/schemas/user-form.schema";

/**
 * 新規ユーザー作成ページのロジックを管理するカスタムフック
 */
export const useNewUser = () => {
  const router = useRouter();
  const createUserMutation = useCreateUser();

  const {
    control,
    handleSubmit,
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

  const onSubmit = handleSubmit((data) => {
    createUserMutation
      .mutateAsync(data)
      .then(() => {
        router.push("/sample-users");
      })
      .catch(() => {
        setError("root", {
          message: "ユーザーの作成に失敗しました",
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
    isSubmitting,
  };
};
