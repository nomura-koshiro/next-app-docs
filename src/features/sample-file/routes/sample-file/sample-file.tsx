'use client';

import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';

import { FileDownloadSection } from './components/file-download-section';
import { FileUploadSection } from './components/file-upload-section';
import { useSampleFile } from './sample-file.hook';

/**
 * ファイルアップロード・ダウンロードページコンポーネント
 *
 * ファイルのアップロード・ダウンロード機能のサンプル実装を提供します。
 */
export default function SampleFilePage() {
  // ================================================================================
  // フック
  // ================================================================================
  const { uploadedFiles, isUploading, handleFileDrop, handleFileRemove, downloadProgress, isDownloading, handleDownload } = useSampleFile();

  // ================================================================================
  // レンダリング
  // ================================================================================
  return (
    <PageLayout maxWidth="6xl">
      <PageHeader title="ファイルアップロード・ダウンロード" description="react-dropzone + file-saver を使ったファイル操作のサンプル" />

      <div className="space-y-8">
        {/* ファイルアップロードセクション */}
        <FileUploadSection
          uploadedFiles={uploadedFiles}
          onFileDrop={handleFileDrop}
          onFileRemove={handleFileRemove}
          isUploading={isUploading}
        />

        {/* ファイルダウンロードセクション */}
        <FileDownloadSection onDownload={handleDownload} downloadProgress={downloadProgress} isDownloading={isDownloading} />
      </div>
    </PageLayout>
  );
}
