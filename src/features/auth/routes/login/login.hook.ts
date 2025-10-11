import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin as useLoginMutation } from "@/features/auth/api/login";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-form.schema";

/**
 * ログインページのロジックを管理するカスタムフック
 */
export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation({
    mutationConfig: {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/users");
      },
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const errorMessage = loginMutation.isError
    ? "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
    : null;

  return {
    form,
    handleSubmit,
    isLoading: loginMutation.isPending,
    error: errorMessage,
  };
};
