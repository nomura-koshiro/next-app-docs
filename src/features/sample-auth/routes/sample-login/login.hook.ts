"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useLogin as useLoginMutation } from "@/features/sample-auth/api/login";
import { loginFormSchema, type LoginFormValues } from "@/features/sample-auth/schemas/login-form.schema";
import { useAuthStore } from "@/features/sample-auth/stores/auth-store";
import { setValidatedToken } from "@/features/sample-auth/stores/schemas/token-storage.schema";

/**
 * ログインページのロジックを管理するカスタムフック
 *
 * react-hook-formとzodスキーマによるバリデーションを使用し、
 * FastAPI経由でログイン認証を実行します。
 * 成功時はZustandストアにユーザー情報を保存し、ユーザー一覧ページへ遷移します。
 *
 * @returns ログインフォームの状態と操作関数
 * @returns control - react-hook-formのcontrolオブジェクト
 * @returns onSubmit - ログイン送信ハンドラー
 * @returns errors - バリデーションエラー
 * @returns isSubmitting - 送信中フラグ
 *
 * @example
 * ```tsx
 * const { control, onSubmit, errors, isSubmitting } = useLogin()
 *
 * <form onSubmit={onSubmit}>
 *   <Controller name="email" control={control} />
 *   <Controller name="password" control={control} />
 *   {errors.root && <span>{errors.root.message}</span>}
 *   <button disabled={isSubmitting}>ログイン</button>
 * </form>
 * ```
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
  /**
   * ログイン送信ハンドラー
   *
   * 処理フロー:
   * 1. FastAPIにログインリクエスト送信
   * 2. 成功時:
   *    - トークンをlocalStorageに保存
   *    - ユーザー情報をZustandストアに保存
   *    - ユーザー一覧ページへ遷移
   * 3. エラー時: フォームにエラーメッセージを表示
   */
  const onSubmit = handleSubmit(async (values: LoginFormValues) => {
    await loginMutation
      .mutateAsync(values)
      .then((data) => {
        try {
          // ✅ トークンをバリデーション後にlocalStorageに保存
          setValidatedToken("token", data.token);

          // ユーザー情報をZustandストアに保存
          setUser(data.user);

          // ユーザー一覧ページへ遷移
          router.push("/users");
        } catch (error) {
          // トークン形式が不正な場合
          console.error("トークンバリデーションエラー:", error);
          setError("root", {
            message: "サーバーから不正なトークンが返されました。管理者に連絡してください。",
          });
        }
      })
      .catch(() => {
        // ログイン失敗時のエラーメッセージを表示
        setError("root", {
          message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        });
      });
  });

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    control,
    onSubmit,
    errors,
    isSubmitting: loginMutation.isPending,
  };
};
