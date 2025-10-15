/**
 * ログインAPI
 *
 * TODO: 実際のバックエンドAPIエンドポイントに合わせて修正してください
 * TODO: 現在はモック実装です
 */

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/tanstack-query';

import type { User } from '../types';

// ================================================================================
// Schemas
// ================================================================================

/**
 * ログイン入力スキーマ
 */
export const loginInputSchema = z.object({
  email: z.string().min(1, 'メールアドレスは必須です').email('正しいメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// ================================================================================
// Types
// ================================================================================

/**
 * ログインレスポンス
 */
export type LoginResponse = {
  user: User;
  token: string; // JWT token
};

// ================================================================================
// API Functions
// ================================================================================

/**
 * ログインAPI呼び出し
 *
 * エンドポイント: POST /api/v1/sample/auth/login
 * TODO: バックエンドから返されるレスポンス形式に合わせて修正してください
 */
export const login = (data: LoginInput): Promise<LoginResponse> => {
  // TODO: 実際のAPI呼び出しに置き換える
  return api.post('/sample/auth/login', data);

  // モック実装（テスト用）
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       user: {
  //         id: "1",
  //         email: data.email,
  //         name: "Sample User",
  //         role: "user",
  //       },
  //       token: "mock-jwt-token",
  //     });
  //   }, 1000);
  // });
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
