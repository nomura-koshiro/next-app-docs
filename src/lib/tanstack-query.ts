import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

/**
 * React Query のデフォルト設定
 *
 * アプリケーション全体で使用されるReact Queryの共通設定を定義します。
 *
 * @property queries.refetchOnWindowFocus - ウィンドウフォーカス時の自動再取得を無効化
 * @property queries.retry - エラー時の自動リトライを無効化
 * @property queries.staleTime - データが古いと判断されるまでの時間（1分）
 */
export const queryConfig = {
  queries: {
    // throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5分（データの性質に応じて調整）
  },
} satisfies DefaultOptions;

/**
 * API関数の戻り値の型を抽出するユーティリティ型
 *
 * @template FnType - Promise を返す関数の型
 * @example
 * ```ts
 * const fetchUser = async (id: string) => { ... }
 * type UserData = ApiFnReturnType<typeof fetchUser>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<ReturnType<FnType>>;

/**
 * クエリ設定のユーティリティ型
 *
 * queryKey と queryFn を除いたクエリオプションの型を生成します。
 *
 * @template T - クエリフック関数の型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<ReturnType<T>, 'queryKey' | 'queryFn'>;

/**
 * Mutation設定のユーティリティ型
 *
 * React QueryのuseMutationで使用する型安全な設定オプションを提供します。
 *
 * @template MutationFnType - Promise を返すMutation関数の型
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
