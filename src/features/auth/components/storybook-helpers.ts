// ================================================================================
// Imports
// ================================================================================

import { MOCK_AUTH } from "@/mocks/handlers/api/v1/auth/auth-handlers";

import type { User } from "../stores/auth-store";
import { useAuthStore } from "../stores/auth-store";

// ================================================================================
// 定数
// ================================================================================

/** Zustandの認証ストアで使用されるsessionStorageのキー */
const AUTH_STORAGE_KEY = "azure-auth-storage";

/** 認証済み状態のデータ */
const AUTHENTICATED_DATA = {
  user: MOCK_AUTH.USER,
  isAuthenticated: true,
} as const;

/** 未認証状態のデータ */
const UNAUTHENTICATED_DATA = {
  user: null,
  isAuthenticated: false,
} as const;

// ================================================================================
// 型定義
// ================================================================================

/** Storybook用の認証状態データ型 */
type AuthStateData = {
  user: User | null;
  isAuthenticated: boolean;
};

// ================================================================================
// ロギングユーティリティ
// ================================================================================

/**
 * 開発環境のみでログを出力するユーティリティ関数
 */
const log = (message: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Storybook Auth] ${message}`, ...args);
  }
};

// ================================================================================
// 内部ヘルパー関数
// ================================================================================

/**
 * sessionStorage形式の認証状態を作成
 *
 * @param data - 認証状態データ
 * @returns sessionStorage保存用のオブジェクト
 */
const createStorageAuthState = (data: AuthStateData) => ({
  state: {
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    account: null,
  },
});

/**
 * sessionStorageとZustandストアを同期して設定
 *
 * @param data - 認証状態データ
 */
const applyAuthState = (data: AuthStateData): void => {
  log("Called with:", { isAuthenticated: data.isAuthenticated, user: data.user?.name });

  // sessionStorageを設定
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(data)));
  log("sessionStorage updated");

  // Zustandストアを設定
  useAuthStore.setState({
    user: data.user,
    isAuthenticated: data.isAuthenticated,
    account: null,
  });
  log("Zustand store updated:", {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name,
  });
};

// ================================================================================
// デコレーター用（sessionStorageとZustandストア両方を設定）
// ================================================================================

/**
 * デコレーター用: 認証済み状態のsessionStorageとZustandストアを設定
 *
 * Storybookのデコレーターから呼び出され、認証済み状態を初期化します。
 */
export const setAuthenticatedStorage = (): void => {
  log("setAuthenticatedStorage - BEFORE clear:", sessionStorage.getItem(AUTH_STORAGE_KEY));

  // sessionStorageを設定
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(AUTHENTICATED_DATA)));
  log("setAuthenticatedStorage - AFTER set:", sessionStorage.getItem(AUTH_STORAGE_KEY));

  // Zustandストアも設定
  useAuthStore.setState({
    user: AUTHENTICATED_DATA.user,
    isAuthenticated: AUTHENTICATED_DATA.isAuthenticated,
    account: null,
  });
  log("Zustand store updated:", {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name,
  });
};

/**
 * デコレーター用: 未認証状態のsessionStorageとZustandストアを設定
 *
 * Storybookのデコレーターから呼び出され、未認証状態を初期化します。
 */
export const setUnauthenticatedStorage = (): void => {
  log("setUnauthenticatedStorage - BEFORE clear:", sessionStorage.getItem(AUTH_STORAGE_KEY));

  // sessionStorageを設定
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createStorageAuthState(UNAUTHENTICATED_DATA)));
  log("setUnauthenticatedStorage - AFTER set:", sessionStorage.getItem(AUTH_STORAGE_KEY));

  // Zustandストアも設定
  useAuthStore.setState({
    user: UNAUTHENTICATED_DATA.user,
    isAuthenticated: UNAUTHENTICATED_DATA.isAuthenticated,
    account: null,
  });
  log("Zustand store updated:", {
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user?.name,
  });
};

// ================================================================================
// loaders用（互換性のため残しているが、実際の処理はなし）
// ================================================================================

/**
 * Storybook loaders用: 認証済み状態
 *
 * 注意: loaderはNode環境で実行されるため、sessionStorageやZustandストアにアクセスできません。
 * 実際の状態設定はデコレーターとplay関数で行います。
 *
 * @returns 空のオブジェクト
 */
export const authenticatedLoader = async () => {
  log("authenticatedLoader called (but does nothing in Node environment)");

  return {};
};

/**
 * Storybook loaders用: 未認証状態
 *
 * 注意: loaderはNode環境で実行されるため、sessionStorageやZustandストアにアクセスできません。
 * 実際の状態設定はデコレーターとplay関数で行います。
 *
 * @returns 空のオブジェクト
 */
export const unauthenticatedLoader = async () => {
  log("unauthenticatedLoader called (but does nothing in Node environment)");

  return {};
};

// ================================================================================
// play関数用
// ================================================================================

/**
 * play関数用: 認証済み状態を設定
 *
 * Storybookのplay関数から呼び出され、認証済み状態に更新します。
 */
export const setAuthenticatedState = (): void => {
  log("setAuthenticatedState called");
  applyAuthState(AUTHENTICATED_DATA);
};

/**
 * play関数用: 未認証状態を設定
 *
 * Storybookのplay関数から呼び出され、未認証状態に更新します。
 */
export const setUnauthenticatedState = (): void => {
  log("setUnauthenticatedState called");
  applyAuthState(UNAUTHENTICATED_DATA);
};
