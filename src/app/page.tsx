import Image from 'next/image';
import Link from 'next/link';

export default function Home(): React.ReactElement {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Plain Next.js Template</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            このプロジェクトには、フォーム、認証、CRUD操作など、実装パターンのサンプルが含まれています。
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded transition-all flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:bg-primary/90 hover:shadow-md font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/sample-page-list"
          >
            サンプルを見る
          </Link>
          <a
            className="rounded border border-solid border-border transition-all flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">📝 フォーム</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">React Hook Form + Zodによるバリデーション</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">🔐 認証</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">ログイン・ログアウト機能の実装例</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">📊 データ管理</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">TanStack QueryでのCRUD操作</p>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
