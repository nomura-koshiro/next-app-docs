import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin as useLoginMutation } from "@/features/sample-auth/api/login";
import { useAuthStore } from "@/features/sample-auth/stores/auth-store";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/sample-auth/schemas/login-form.schema";

/**
 * ログインページのロジックを管理するカスタムフック
 */
export const useLogin = () => {
  // ================================================================================
  // Hooks
  // ================================================================================
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useLoginMutation();

  // ================================================================================
  // Form
  // ================================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ================================================================================
  // Handlers
  // ================================================================================
  const onSubmit = handleSubmit((values) => {
    loginMutation
      .mutateAsync(values)
      .then((data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/users");
      })
      .catch(() => {
        setError("root", {
          message:
            "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        });
      });
  });

  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending,
  };
};
