import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';

import SampleFilePage from './sample-file';

/**
 * SampleFilePageコンポーネントのストーリー
 *
 * ファイルアップロード・ダウンロードページコンポーネント。
 * ファイルのアップロード・ダウンロード機能のサンプル実装を提供します。
 *
 * @example
 * ```tsx
 * <SampleFilePage />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-file/routes/sample-file/SampleFile',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: SampleFilePage,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // ================================================================================
    layout: 'fullscreen',

    // ================================================================================
    // Next.js設定
    // ================================================================================
    nextjs: {
      appDirectory: true,
    },

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          'ファイルのアップロード・ダウンロード機能を提供するページコンポーネント。react-dropzoneとfile-saverを使用した実装例です。\n\n' +
          '**主な機能:**\n' +
          '- react-dropzoneを使用したドラッグ&ドロップアップロード\n' +
          '- 複数ファイルの同時アップロード\n' +
          '- アップロード進捗の表示\n' +
          '- 各種形式でのファイルダウンロード（CSV, Excel, JSON, テキスト, 画像）\n' +
          '- ダウンロード進捗の表示\n' +
          '- 楽観的UI更新（React 19 useOptimistic）\n' +
          '- MSWによるAPIモック\n\n' +
          '**使用場面:**\n' +
          '- ファイルアップロード機能\n' +
          '- データエクスポート機能\n' +
          '- ドキュメント管理システム',
      },
    },

    // ================================================================================
    // MSWハンドラー - ファイルアップロード
    // ================================================================================
    msw: {
      handlers: [
        http.post('*/api/v1/sample/files/upload', async () => {
          // アップロード処理のシミュレーション
          await delay(1000);

          return HttpResponse.json({
            success: true,
            fileId: `file-${Date.now()}`,
            url: '/uploads/sample-file.pdf',
          });
        }),
      ],
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],
} satisfies Meta<typeof SampleFilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ファイルページの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  parameters: {
    docs: {
      description: {
        story: 'ファイルページの初期状態。アップロードセクションとダウンロードセクションの両方が表示されます。',
      },
    },
  },
};

/**
 * ファイルダウンロード（CSV）
 * CSVファイルのダウンロード操作
 */
export const DownloadCSV: Story = {
  name: 'CSVダウンロード',
  parameters: {
    docs: {
      description: {
        story: 'CSVファイルのダウンロード操作をシミュレート。BOM付きUTF-8でExcelでも文字化けしないCSVを生成します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // CSVダウンロードボタンを探してクリック
    const csvButtons = canvas.getAllByRole('button');
    const csvButton = csvButtons.find((button) => button.textContent?.includes('CSV'));

    if (csvButton) {
      await userEvent.click(csvButton);
      // ダウンロードが開始されることを確認
      // 実際のファイルダウンロードはStorybook環境では完全にはテストできない
    }
  },
};

/**
 * ファイルダウンロード（Excel）
 * Excelファイルのダウンロード操作
 */
export const DownloadExcel: Story = {
  name: 'Excelダウンロード',
  parameters: {
    docs: {
      description: {
        story: 'Excelファイルのダウンロード操作をシミュレート。exceljsを使用してスタイル付きExcelファイルを生成します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Excelダウンロードボタンを探してクリック
    const buttons = canvas.getAllByRole('button');
    const excelButton = buttons.find((button) => button.textContent?.includes('Excel'));

    if (excelButton) {
      await userEvent.click(excelButton);
    }
  },
};

/**
 * ファイルダウンロード（JSON）
 * JSONファイルのダウンロード操作
 */
export const DownloadJSON: Story = {
  name: 'JSONダウンロード',
  parameters: {
    docs: {
      description: {
        story: 'JSONファイルのダウンロード操作をシミュレート。整形された読みやすいJSON形式でデータをエクスポートします。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // JSONダウンロードボタンを探してクリック
    const buttons = canvas.getAllByRole('button');
    const jsonButton = buttons.find((button) => button.textContent?.includes('JSON'));

    if (jsonButton) {
      await userEvent.click(jsonButton);
    }
  },
};

/**
 * ファイルアップロード操作
 * ファイルを選択してアップロードする操作
 */
export const FileUpload: Story = {
  name: 'ファイルアップロード',
  parameters: {
    docs: {
      description: {
        story:
          'ファイルアップロード操作のシミュレーション。ドロップゾーンをクリックしてファイルを選択できます。楽観的UI更新により、ファイルが即座にリストに表示されます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ファイル選択ボタンを探す
    const selectButton = canvas.getByRole('button', { name: /ファイルを選択/i });
    expect(selectButton).toBeInTheDocument();

    // 注意: 実際のファイル選択はStorybook環境では完全にはシミュレートできない
    // ここではボタンの存在確認のみ
  },
};

/**
 * アップロードエラー
 * ファイルアップロード時にエラーが発生
 */
export const UploadError: Story = {
  name: 'アップロードエラー',
  parameters: {
    docs: {
      description: {
        story: 'ファイルアップロード時にエラーが発生した場合の状態。エラーメッセージが表示され、ユーザーに通知されます。',
      },
    },
    msw: {
      handlers: [
        http.post('*/api/v1/sample/files/upload', async () => {
          await delay(500);

          return HttpResponse.json({ message: 'File too large' }, { status: 413 });
        }),
      ],
    },
  },
};

/**
 * 複数セクション表示
 * アップロードセクションとダウンロードセクションの両方を確認
 */
export const MultipleSections: Story = {
  name: '複数セクション表示',
  parameters: {
    docs: {
      description: {
        story: 'ページ全体のレイアウトを確認。アップロードセクションとダウンロードセクションが適切に配置されています。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // アップロードセクションの要素を確認
    const uploadButton = canvas.getByRole('button', { name: /ファイルを選択/i });
    expect(uploadButton).toBeInTheDocument();

    // ダウンロードセクションの要素を確認（CSVボタン）
    const csvButton = canvas.getByRole('button', { name: /CSV/i });
    expect(csvButton).toBeInTheDocument();
  },
};

/**
 * ページヘッダー表示
 * ページのタイトルと説明を確認
 */
export const PageHeader: Story = {
  name: 'ページヘッダー',
  parameters: {
    docs: {
      description: {
        story: 'ページヘッダーの表示を確認。タイトルと説明が適切に表示されます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ページタイトルを確認
    const title = canvas.getByRole('heading', { name: /ファイルアップロード・ダウンロード/i });
    expect(title).toBeInTheDocument();

    // 説明文を確認
    const description = canvas.getByText(/react-dropzone \+ file-saver を使ったファイル操作のサンプル/i);
    expect(description).toBeInTheDocument();
  },
};

/**
 * レスポンシブレイアウト
 * 異なる画面サイズでのレイアウト確認
 */
export const ResponsiveLayout: Story = {
  name: 'レスポンシブレイアウト',
  parameters: {
    docs: {
      description: {
        story: 'レスポンシブデザインの確認。異なる画面サイズでも適切にレイアウトされます。',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
