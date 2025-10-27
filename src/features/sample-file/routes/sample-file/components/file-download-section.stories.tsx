import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import type { FileType } from '../../../types';
import { FileDownloadSection } from './file-download-section';

/**
 * FileDownloadSectionコンポーネントのストーリー
 *
 * ファイルダウンロードセクションコンポーネント。
 * 各種形式のファイルダウンロード機能を提供します。
 *
 * @example
 * ```tsx
 * <FileDownloadSection
 *   onDownload={handleDownload}
 *   downloadProgress={downloadProgress}
 *   isDownloading={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-file/routes/sample-file/components/FileDownloadSection',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: FileDownloadSection,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: 'padded',

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          'ファイルダウンロード機能を提供するコンポーネント。CSV、Excel、JSON、テキスト、画像など各種形式でのダウンロードをサポートします。\n\n' +
          '**主な機能:**\n' +
          '- 複数のファイル形式のサポート（CSV, Excel, JSON, テキスト, 画像）\n' +
          '- ダウンロード進捗の表示\n' +
          '- ファイル形式ごとの説明とアイコン\n' +
          '- ダウンロード中の状態管理\n\n' +
          '**使用場面:**\n' +
          '- データエクスポート機能\n' +
          '- レポート生成機能\n' +
          'ファイル変換機能',
      },
    },

    // ================================================================================
    // 背景色のテストオプション
    // 異なる背景色でコンポーネントの見た目を確認できます
    // ================================================================================
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ['autodocs'],

  // ================================================================================
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    onDownload: {
      description: 'ダウンロードハンドラー',
      table: {
        type: { summary: '(type: FileType) => void' },
        category: 'イベント',
      },
    },
    downloadProgress: {
      description: 'ダウンロード進捗情報',
      table: {
        type: { summary: 'DownloadProgress' },
        category: '状態',
      },
    },
    isDownloading: {
      control: 'boolean',
      description: 'ダウンロード中かどうか',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '状態',
      },
    },
  },

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    onDownload: fn(),
    downloadProgress: {
      fileType: null,
      progress: 0,
    },
    isDownloading: false,
  },
} satisfies Meta<typeof FileDownloadSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ダウンロードセクションの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    downloadProgress: {
      fileType: null,
      progress: 0,
    },
    isDownloading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ダウンロードセクションの初期状態。すべてのファイル形式のダウンロードボタンが表示されます。',
      },
    },
  },
};

/**
 * CSVダウンロード中
 * CSV形式のファイルをダウンロード中
 */
export const DownloadingCSV: Story = {
  name: 'CSVダウンロード中',
  args: {
    downloadProgress: {
      fileType: 'csv' as FileType,
      progress: 45,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'CSV形式のファイルをダウンロード中の状態。進捗バーが表示され、他のボタンは無効化されます。',
      },
    },
  },
};

/**
 * Excelダウンロード中
 * Excel形式のファイルをダウンロード中
 */
export const DownloadingExcel: Story = {
  name: 'Excelダウンロード中',
  args: {
    downloadProgress: {
      fileType: 'excel' as FileType,
      progress: 75,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Excel形式のファイルをダウンロード中の状態。進捗バーでダウンロードの進行状況を表示します。',
      },
    },
  },
};

/**
 * JSONダウンロード中
 * JSON形式のファイルをダウンロード中
 */
export const DownloadingJSON: Story = {
  name: 'JSONダウンロード中',
  args: {
    downloadProgress: {
      fileType: 'json' as FileType,
      progress: 30,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'JSON形式のファイルをダウンロード中の状態。構造化データのエクスポートに使用します。',
      },
    },
  },
};

/**
 * テキストダウンロード中
 * テキスト形式のファイルをダウンロード中
 */
export const DownloadingText: Story = {
  name: 'テキストダウンロード中',
  args: {
    downloadProgress: {
      fileType: 'text' as FileType,
      progress: 60,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'テキスト形式のファイルをダウンロード中の状態。プレーンテキストでのダウンロードです。',
      },
    },
  },
};

/**
 * 画像ダウンロード中
 * 画像ファイルをダウンロード中
 */
export const DownloadingImage: Story = {
  name: '画像ダウンロード中',
  args: {
    downloadProgress: {
      fileType: 'image' as FileType,
      progress: 90,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '画像ファイルをダウンロード中の状態。Canvas APIで動的生成した画像のダウンロードです。',
      },
    },
  },
};

/**
 * ダウンロード開始直後
 * ダウンロードを開始したばかりの状態
 */
export const DownloadStarted: Story = {
  name: 'ダウンロード開始直後',
  args: {
    downloadProgress: {
      fileType: 'csv' as FileType,
      progress: 5,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ダウンロードを開始したばかりの状態。進捗バーが表示され始めます。',
      },
    },
  },
};

/**
 * ダウンロード完了直前
 * ダウンロードがほぼ完了している状態
 */
export const DownloadAlmostComplete: Story = {
  name: 'ダウンロード完了直前',
  args: {
    downloadProgress: {
      fileType: 'excel' as FileType,
      progress: 95,
    },
    isDownloading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ダウンロードがほぼ完了している状態。あと少しで完了します。',
      },
    },
  },
};
