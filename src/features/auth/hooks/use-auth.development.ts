// ================================================================================
// Imports
// ================================================================================

import { MOCK_AUTH } from '@/mocks/handlers/api/v1/auth-handlers';

import { useAuthStore } from '../stores/auth-store';

// ================================================================================
// Development Auth Hook
// ================================================================================

/**
 * 注意: 自動ログイン機能は無効化されています。
 * Storybook環境でのテストを可能にするため、手動でログインする必要があります。
 */
export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading: false,
    login: () => {
      setUser(MOCK_AUTH.USER);
    },
    logout: () => logout(),
    getAccessToken: async () => MOCK_AUTH.TOKEN,
  };
};
