import { DefaultOptions, UseMutationOptions } from "@tanstack/react-query";

import { ApiError } from "./api-client";

/**
 * アプリケーション全体で使用されるReact Queryの共通設定を定義します。
 */
export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // ApiErrorの場合、リトライロジックをカスタマイズ
      if (error instanceof ApiError) {
        // 4xxクライアントエラーはリトライしない
        if (error.isClientError()) {
          return false;
        }

        // 5xxサーバーエラーは3回までリトライ
        return failureCount < 3;
      }

      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5分（データの性質に応じて調整）
  },
  mutations: {
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error("[Mutation Error]", error.toJSON());

        // TODO: 通知システムと統合
        // useNotifications.getState().addNotification({
        //   type: 'error',
        //   title: error.title,
        //   message: error.detail,
        // });
      }
    },
  },
} satisfies DefaultOptions;

/**
 * @example
 * ```ts
 * const fetchUser = async (id: string) => { ... }
 * type UserData = ApiFnReturnType<typeof fetchUser>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<ReturnType<FnType>>;

/**
 * queryKey と queryFn を除いたクエリオプションの型を生成します。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<ReturnType<T>, "queryKey" | "queryFn">;

/**
 * @example
 * ```ts
 * const createUser = async (data: CreateUserDTO) => { ... }
 * type CreateUserConfig = MutationConfig<typeof createUser>
 * ```
 */
export type MutationConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<ApiFnReturnType<MutationFnType>, Error, Parameters<MutationFnType>[0]>;
