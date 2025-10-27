import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/sample-ui/card';
import type { SampleItem } from '@/features/sample-page-list/constants/samples';

/**
 * サンプル一覧コンテンツのプロップス
 */
type SampleListContentProps = {
  samples: SampleItem[];
};

/**
 * サンプル一覧のコンテンツ表示コンポーネント
 *
 * カテゴリ別にグループ化されたサンプルページへのリンクカードを表示します。
 */
export const SampleListContent = ({ samples }: SampleListContentProps) => {
  // ================================================================================
  // 変数
  // ================================================================================
  // カテゴリごとにグループ化
  const groupedSamples = samples.reduce(
    (acc, sample) => {
      if (acc[sample.category] === undefined) {
        acc[sample.category] = [];
      }
      acc[sample.category].push(sample);

      return acc;
    },
    {} as Record<string, SampleItem[]>
  );

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedSamples).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((sample) => (
                <Link key={sample.href} href={sample.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <h3 className="font-semibold text-lg text-foreground">{sample.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{sample.description}</p>
                      <div className="mt-4 flex items-center text-sm text-primary font-medium">
                        <span>サンプルを見る →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-semibold mb-2 text-foreground">💡 ヒント</h3>
        <ul className="text-sm space-y-2 text-foreground/80">
          <li>
            • 各サンプルページのソースコードは{' '}
            <code className="bg-white border border-border px-2 py-0.5 rounded text-xs">src/features/sample-*/</code> ディレクトリにあります
          </li>
          <li>
            • Storybookでコンポーネント単位のサンプルも確認できます（
            <code className="bg-white border border-border px-2 py-0.5 rounded text-xs">pnpm storybook</code>）
          </li>
          <li>
            • 新しいfeatureを作成するには{' '}
            <code className="bg-white border border-border px-2 py-0.5 rounded text-xs">pnpm generate:feature</code>{' '}
            コマンドを使用してください
          </li>
        </ul>
      </div>
    </>
  );
};
