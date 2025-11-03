/**
 * ログインAPI
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 * TODO: 現在はモック実装です
 */

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";

import { LoginResponseSchema } from "./schemas/auth-response.schema";
import type { LoginResponse } from "./schemas/auth-response.schema";

// ================================================================================
// Schemas
// ================================================================================

/**
 * ログイン入力スキーマ
 */
export const loginInputSchema = z.object({
  email: z.string().min(1, "メールアドレスは必須です").email("正しいメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// ================================================================================
// API関数
// ================================================================================

/**
 * ログインAPI呼び出し
 *
 * エンドポイント: POST /api/v1/sample/auth/login
 * TODO: バックエンドから返されるレスポンス形式に合わせて修正してください
 *
 * @param data - ログイン情報（メールアドレスとパスワード）
 * @returns ユーザー情報とJWTトークンを含むレスポンス
 *
 * @example
 * ```tsx
 * const response = await login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * console.log(response.user, response.token);
 * ```
 */
export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await api.post("/api/v1/sample/auth/login", data);
  return LoginResponseSchema.parse(response);
};

// ================================================================================
// Hooks
// ================================================================================

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof login>;
};

/**
 * ログインMutation Hook
 *
 * @param options - フックオプション
 * @param options.mutationConfig - React Queryのミューテーション設定
 * @returns ログインミューテーションオブジェクト
 *
 * @example
 * ```tsx
 * import { useLogin } from '@/features/sample-auth/api/login'
 * import { useAuthStore } from '@/features/sample-auth/stores/auth-store'
 *
 * function LoginForm() {
 *   const setUser = useAuthStore((state) => state.setUser)
 *   const loginMutation = useLogin({
 *     mutationConfig: {
 *       onSuccess: (data) => {
 *         // JWTトークンをLocalStorageに保存
 *         localStorage.setItem('token', data.token)
 *         // ユーザー情報をZustandストアに保存
 *         setUser(data.user)
 *       },
 *     },
 *   })
 *
 *   const handleSubmit = (values: LoginInput) => {
 *     loginMutation.mutate(values)
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export const useLogin = ({ mutationConfig }: UseLoginOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // TODO: 必要に応じてグローバルな成功処理を追加
      // 例: トースト通知、アナリティクス送信など
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: login,
  });
};
