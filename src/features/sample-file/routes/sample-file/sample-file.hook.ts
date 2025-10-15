'use client';

import { useCallback, useState } from 'react';

import { uploadFile } from '../../api';
import type { DownloadProgress, FileType, UploadedFile } from '../../types';
import { downloadBlob, generateFilename } from '../../utils/download-helper';
import {
  generateCsvBlob,
  generateExcelBlob,
  generateImageBlob,
  generateJsonBlob,
  generateSampleData,
  generateTextBlob,
} from '../../utils/file-generators';

/**
 * ファイルアップロード・ダウンロード機能のカスタムフック
 */
export const useSampleFile = () => {
  // ================================================================================
  // State
  // ================================================================================
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    fileType: null,
    progress: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // ================================================================================
  // Upload Handlers
  // ================================================================================

  /**
   * ファイルドロップハンドラー
   */
  const handleFileDrop = useCallback(
    async (files: File[]) => {
      // ファイルをアップロード待ちリストに追加
      const newFiles: UploadedFile[] = files.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(true);

      // 各ファイルを順次アップロード
      for (let i = 0; i < files.length; i++) {
        const fileIndex = uploadedFiles.length + i;

        try {
          // ステータスを「アップロード中」に更新
          setUploadedFiles((prev) => prev.map((f, idx) => (idx === fileIndex ? { ...f, status: 'uploading' as const } : f)));

          // アップロード実行（MSWでモック）
          await uploadFile(files[i], (progress) => {
            setUploadedFiles((prev) => prev.map((f, idx) => (idx === fileIndex ? { ...f, progress } : f)));
          });

          // ステータスを「成功」に更新
          setUploadedFiles((prev) => prev.map((f, idx) => (idx === fileIndex ? { ...f, status: 'success' as const } : f)));
        } catch (error) {
          // エラー時の処理
          setUploadedFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex
                ? {
                    ...f,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'アップロードに失敗しました',
                  }
                : f
            )
          );
        }
      }

      setIsUploading(false);
    },
    [uploadedFiles.length]
  );

  /**
   * ファイル削除ハンドラー
   */
  const handleFileRemove = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ================================================================================
  // Download Handlers
  // ================================================================================

  /**
   * ファイルダウンロードハンドラー
   */
  const handleDownload = useCallback(async (type: FileType) => {
    setIsDownloading(true);
    setDownloadProgress({ fileType: type, progress: 0 });

    try {
      const sampleData = generateSampleData();
      let blob: Blob;
      let filename: string;

      // 進捗シミュレーション（実際のAPI経由の場合は不要）
      const simulateProgress = async () => {
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setDownloadProgress({ fileType: type, progress });
        }
      };

      const progressPromise = simulateProgress();

      switch (type) {
        case 'csv':
          await progressPromise;
          blob = generateCsvBlob(sampleData);
          filename = generateFilename('sample_data', 'csv');
          break;

        case 'excel':
          await progressPromise;
          blob = await generateExcelBlob(sampleData);
          filename = generateFilename('sample_data', 'xlsx');
          break;

        case 'json':
          await progressPromise;
          blob = generateJsonBlob(sampleData);
          filename = generateFilename('sample_data', 'json');
          break;

        case 'text':
          await progressPromise;
          blob = generateTextBlob(sampleData);
          filename = generateFilename('sample_data', 'txt');
          break;

        case 'image':
          await progressPromise;
          blob = await generateImageBlob();
          filename = generateFilename('sample_image', 'png');
          break;

        default:
          throw new Error('Unknown file type');
      }

      // 進捗を100%に更新
      setDownloadProgress({ fileType: type, progress: 100 });

      // ダウンロード実行
      downloadBlob(blob, filename);

      // 少し待ってから進捗をリセット
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Download failed:', error);
      alert(`ダウンロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsDownloading(false);
      setDownloadProgress({ fileType: null, progress: 0 });
    }
  }, []);

  // ================================================================================
  // Return
  // ================================================================================
  return {
    // Upload
    uploadedFiles,
    isUploading,
    handleFileDrop,
    handleFileRemove,
    // Download
    downloadProgress,
    isDownloading,
    handleDownload,
  };
};
