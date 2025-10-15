import Link from 'next/link';

import { paths } from '@/config/paths';

/**
 * 404 Not Found ページ
 *
 * 存在しないページにアクセスした際に表示されるカスタム404ページ。
 * Next.jsが自動的にこのコンポーネントをレンダリングします。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
const NotFoundPage = (): React.ReactElement => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1 className="text-4xl mb-4">404 - Not Found</h1>
      <p className="text-lg mb-8 text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <Link href={paths.home.getHref()} replace className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
