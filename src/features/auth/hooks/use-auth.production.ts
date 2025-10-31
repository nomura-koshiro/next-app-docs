// ================================================================================
// Imports
// ================================================================================

import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

import { loginRequest } from "@/config/msal";

import { useGetMe } from "../api/get-me";
import { useAuthStore } from "../stores/auth-store";

// ================================================================================
// Production Auth Hook
// ================================================================================

/**
 * Azure ADで認証し、バックエンドからユーザー情報を取得します。
 */
export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const { setAccount, setUser, logout: clearAuth } = useAuthStore();
  const { data: userData, isLoading: isUserLoading } = useGetMe({
    enabled: accounts.length > 0,
  });

  // MSALアカウント情報をストアに同期
  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts, setAccount]);

  // ユーザー情報をストアに同期
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  const login = () => {
    void instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    void instance.logoutRedirect();
    clearAuth();
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (accounts.length === 0) return null;

    return instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => response.accessToken)
      .catch((error) => {
        console.error("Token acquisition failed:", error);
        void instance.acquireTokenRedirect(loginRequest);

        return null;
      });
  };

  return {
    user: userData || null,
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== "none" || isUserLoading,
    login,
    logout,
    getAccessToken,
  };
};
