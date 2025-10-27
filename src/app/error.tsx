'use client';

import { useEffect } from 'react';

import { Button } from '@/components/sample-ui/button';
import { Card, CardContent, CardHeader } from '@/components/sample-ui/card';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * エラー境界コンポーネント
 *
 * アプリケーション全体のエラーをキャッチして表示します。
 * Next.js App Routerのエラーハンドリング機能を使用しています。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーログをコンソールに出力（本番環境ではエラートラッキングサービスに送信）
    console.error('エラーバウンダリでエラーを捕捉しました:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-destructive">エラーが発生しました</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">申し訳ございません。予期しないエラーが発生しました。</p>

          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-md bg-destructive/10 p-4">
              <p className="text-sm font-mono text-destructive">{error.message}</p>
              {error.digest && <p className="mt-2 text-xs text-muted-foreground">エラーID: {error.digest}</p>}
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={reset} className="flex-1">
              再試行
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = '/')} className="flex-1">
              ホームに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
