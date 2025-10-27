import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import type { UploadedFile } from '../../../types';
import { FileUploadSection } from './file-upload-section';

/**
 * FileUploadSectionコンポーネントのストーリー
 *
 * ファイルアップロードセクションコンポーネント。
 * react-dropzone を使用したファイルアップロード機能を提供します。
 *
 * @example
 * ```tsx
 * <FileUploadSection
 *   uploadedFiles={uploadedFiles}
 *   onFileDrop={handleFileDrop}
 *   onFileRemove={handleFileRemove}
 *   isUploading={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: 'features/sample-file/routes/sample-file/components/FileUploadSection',

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: FileUploadSection,

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
          'ファイルアップロード機能を提供するコンポーネント。react-dropzoneを使用したドラッグ&ドロップとファイル選択をサポートします。\n\n' +
          '**主な機能:**\n' +
          '- ドラッグ&ドロップによるファイル選択\n' +
          '- クリックによるファイル選択\n' +
          '- 複数ファイルのアップロード対応\n' +
          '- アップロード進捗の表示\n' +
          '- ファイルサイズ制限（最大10MB）\n' +
          '- アップロード済みファイルの管理\n\n' +
          '**使用場面:**\n' +
          '- ファイルアップロード機能\n' +
          '- 画像アップロード\n' +
          '- ドキュメント管理',
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
    uploadedFiles: {
      description: 'アップロード済みファイルリスト',
      table: {
        type: { summary: 'UploadedFile[]' },
        category: '状態',
      },
    },
    onFileDrop: {
      description: 'ファイルドロップハンドラー',
      table: {
        type: { summary: '(files: File[]) => void' },
        category: 'イベント',
      },
    },
    onFileRemove: {
      description: 'ファイル削除ハンドラー',
      table: {
        type: { summary: '(index: number) => void' },
        category: 'イベント',
      },
    },
    isUploading: {
      control: 'boolean',
      description: 'アップロード中かどうか',
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
    uploadedFiles: [],
    onFileDrop: fn(),
    onFileRemove: fn(),
    isUploading: false,
  },
} satisfies Meta<typeof FileUploadSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// モックファイルを作成するヘルパー関数
const createMockFile = (name: string, size: number): File => {
  return new File(['mock content'], name, { type: 'text/plain' });
};

/**
 * デフォルト状態
 * アップロードセクションの初期状態
 */
export const Default: Story = {
  name: 'デフォルト',
  args: {
    uploadedFiles: [],
    isUploading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'アップロードセクションの初期状態。ドロップゾーンが表示され、ファイルをドラッグ&ドロップまたは選択できます。',
      },
    },
  },
};

/**
 * 1件のファイル（成功）
 * ファイルが1件正常にアップロードされた状態
 */
export const SingleFileSuccess: Story = {
  name: '1件のファイル（成功）',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('document.pdf', 1024 * 1024 * 2), // 2MB
        progress: 100,
        status: 'success',
      },
    ] as UploadedFile[],
    isUploading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ファイルが1件正常にアップロードされた状態。成功のアイコンが表示されます。',
      },
    },
  },
};

/**
 * 複数のファイル（成功）
 * 複数のファイルが正常にアップロードされた状態
 */
export const MultipleFilesSuccess: Story = {
  name: '複数のファイル（成功）',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('document1.pdf', 1024 * 1024 * 2),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('image.png', 1024 * 500),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('spreadsheet.xlsx', 1024 * 1024 * 3),
        progress: 100,
        status: 'success',
      },
    ] as UploadedFile[],
    isUploading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '複数のファイルが正常にアップロードされた状態。ファイルリストに複数のファイルが表示されます。',
      },
    },
  },
};

/**
 * アップロード中
 * ファイルをアップロード中の状態
 */
export const Uploading: Story = {
  name: 'アップロード中',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('document.pdf', 1024 * 1024 * 2),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('large-file.zip', 1024 * 1024 * 8),
        progress: 45,
        status: 'uploading',
      },
    ] as UploadedFile[],
    isUploading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ファイルをアップロード中の状態。進捗バーが表示され、ドロップゾーンが無効化されます。',
      },
    },
  },
};

/**
 * アップロードエラー
 * アップロード中にエラーが発生した状態
 */
export const UploadError: Story = {
  name: 'アップロードエラー',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('document.pdf', 1024 * 1024 * 2),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('failed-file.txt', 1024 * 100),
        progress: 0,
        status: 'error',
        error: 'ファイルのアップロードに失敗しました',
      },
    ] as UploadedFile[],
    isUploading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'アップロード中にエラーが発生した状態。エラーアイコンとエラーメッセージが表示されます。',
      },
    },
  },
};

/**
 * 複数の状態が混在
 * 成功、アップロード中、エラーの状態が混在
 */
export const MixedStatus: Story = {
  name: '複数の状態が混在',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('success1.pdf', 1024 * 1024 * 2),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('uploading.zip', 1024 * 1024 * 5),
        progress: 65,
        status: 'uploading',
      },
      {
        file: createMockFile('success2.png', 1024 * 500),
        progress: 100,
        status: 'success',
      },
      {
        file: createMockFile('error.txt', 1024 * 100),
        progress: 0,
        status: 'error',
        error: 'ネットワークエラーが発生しました',
      },
    ] as UploadedFile[],
    isUploading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '成功、アップロード中、エラーの状態が混在している状態。実際のアップロードシナリオに近い表示です。',
      },
    },
  },
};

/**
 * アップロード開始直後
 * アップロードを開始したばかりの状態
 */
export const UploadStarted: Story = {
  name: 'アップロード開始直後',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('document.pdf', 1024 * 1024 * 2),
        progress: 5,
        status: 'uploading',
      },
    ] as UploadedFile[],
    isUploading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'アップロードを開始したばかりの状態。進捗バーが表示され始めます。',
      },
    },
  },
};

/**
 * アップロード完了直前
 * アップロードがほぼ完了している状態
 */
export const UploadAlmostComplete: Story = {
  name: 'アップロード完了直前',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('large-file.zip', 1024 * 1024 * 8),
        progress: 95,
        status: 'uploading',
      },
    ] as UploadedFile[],
    isUploading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'アップロードがほぼ完了している状態。あと少しで完了します。',
      },
    },
  },
};

/**
 * 大きなファイル
 * サイズの大きなファイルのアップロード
 */
export const LargeFile: Story = {
  name: '大きなファイル',
  args: {
    uploadedFiles: [
      {
        file: createMockFile('very-large-file.zip', 1024 * 1024 * 9.5), // 9.5MB
        progress: 100,
        status: 'success',
      },
    ] as UploadedFile[],
    isUploading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'サイズの大きなファイル（制限の10MB近く）が正常にアップロードされた状態。',
      },
    },
  },
};
