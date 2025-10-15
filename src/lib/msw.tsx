'use client';

import { useEffect, useState } from 'react';

import { env } from '@/config/env';

/**
 * MSW (Mock Service Worker) Provider
 *
 * 開発環境でAPIモックを有効にするためのプロバイダーコンポーネント。
 * env.ENABLE_API_MOCKING=trueの場合のみMSWを初期化します。
 *
 * @example
 * ```tsx
 * // layout.tsxで使用
 * <MSWProvider>
 *   <YourApp />
 * </MSWProvider>
 * ```
 */
export const MSWProvider = ({ children }: { children: React.ReactNode }): React.ReactElement | null => {
  // MSWの初期化が完了したかどうかを管理
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /**
     * MSWを初期化する非同期関数
     * - ブラウザ環境でのみ実行
     * - env.ENABLE_API_MOCKING=trueの場合のみService Workerを起動
     */
    const initMSW = async (): Promise<void> => {
      if (typeof window !== 'undefined' && env.ENABLE_API_MOCKING === true) {
        // MSW workerを動的にインポート（本番環境でのバンドルサイズ削減）
        const { worker } = await import('@/mocks/browser');

        // Service Workerを起動
        // onUnhandledRequest: 'bypass' - モックされていないリクエストは通常通り処理
        await worker.start({
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
          onUnhandledRequest: (req) => {
            // APIリクエスト以外は警告を出さない
            if (!req.url.includes('/api/')) {
              return;
            }
            console.warn('[MSW] Unhandled request:', req.method, req.url);
          },
        });

        console.log('[MSW] Mock Service Worker initialized');
        console.log('[MSW] Registered handlers:', worker.listHandlers().length);
      }

      // 初期化完了をマーク（モッキング無効時も即座に完了）
      setIsReady(true);
    };

    void initMSW();
  }, []);

  // MSWが有効で初期化未完了の場合は何も表示しない
  // これにより、MSW起動前のAPIリクエストを防ぐ
  if (!isReady && env.ENABLE_API_MOCKING === true) {
    return null;
  }

  return <>{children}</>;
};
