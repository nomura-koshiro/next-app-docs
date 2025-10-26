'use client';

import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { SAMPLES } from '@/features/sample-page-list/constants/samples';

import { SampleListContent } from './components/sample-list-content';

/**
 * サンプルページ一覧
 *
 * プロジェクトで利用可能な各種サンプルページへのリンクを提供します。
 */
export default function SamplePageList() {
  return (
    <PageLayout>
      <PageHeader
        title="サンプルページ一覧"
        description="このプロジェクトで利用可能な各種サンプルページです。実装パターンの参考としてご活用ください。"
      />

      <SampleListContent samples={SAMPLES} />
    </PageLayout>
  );
}
