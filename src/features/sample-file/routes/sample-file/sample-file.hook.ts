'use client';

import { useCallback, useOptimistic, useState } from 'react';

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
 *
 * React 19のuseOptimisticを使用して、ファイル選択後の即座のUI反映を実現します。
 * ファイルがリストに追加された後、バックグラウンドでアップロード処理を実行します。
 * アップロードはMSWでモック化され、リアルタイムでプログレスを更新します。
 * ダウンロードはクライアント側でファイルを生成し、様々な形式（CSV、Excel、JSON、Text、Image）に対応します。
 *
 * @returns ファイル操作の状態と操作関数
 * @returns uploadedFiles - 楽観的更新を反映したアップロード済みファイルリスト
 * @returns isUploading - アップロード中フラグ
 * @returns handleFileDrop - ファイルドロップハンドラー
 * @returns handleFileRemove - ファイル削除ハンドラー
 * @returns downloadProgress - ダウンロード進捗状態
 * @returns isDownloading - ダウンロード中フラグ
 * @returns handleDownload - ファイルダウンロードハンドラー
 *
 * @example
 * ```tsx
 * const {
 *   uploadedFiles,
 *   isUploading,
 *   handleFileDrop,
 *   handleFileRemove,
 *   handleDownload
 * } = useSampleFile()
 *
 * <FileDropZone onDrop={handleFileDrop} />
 * {uploadedFiles.map((file, i) => (
 *   <FileItem file={file} onRemove={() => handleFileRemove(i)} />
 * ))}
 * <button onClick={() => handleDownload('csv')}>CSV</button>
 * ```
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

  // 楽観的UI更新のためのuseOptimistic
  // ファイル選択後、即座にリストに表示し、バックグラウンドでアップロード
  const [optimisticFiles, addOptimisticFiles] = useOptimistic(uploadedFiles, (state: UploadedFile[], newFiles: UploadedFile[]) => [
    ...state,
    ...newFiles,
  ]);

  // ================================================================================
  // アップロードハンドラー
  // ================================================================================

  /**
   * ファイルドロップハンドラー（useOptimistic対応版）
   *
   * 処理フロー:
   * 1. ファイル選択後、即座にリストに表示（楽観的更新）
   * 2. バックグラウンドでアップロード処理を実行
   * 3. プログレス更新をリアルタイムで反映
   * 4. 成功時: ステータスを'success'に更新
   * 5. エラー時: ステータスを'error'に更新
   */
  const handleFileDrop = useCallback(
    async (files: File[]) => {
      // ファイルをアップロード待ちリストに追加
      const newFiles: UploadedFile[] = files.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
      }));

      // 即座にUIに反映（楽観的更新）
      addOptimisticFiles(newFiles);

      // ベースとなる状態も更新（楽観的更新を確定）
      setUploadedFiles((prev: UploadedFile[]) => [...prev, ...newFiles]);
      setIsUploading(true);

      // 各ファイルを順次アップロード
      for (let i = 0; i < files.length; i++) {
        const fileIndex = uploadedFiles.length + i;

        // ステータスを「アップロード中」に更新
        setUploadedFiles((prev: UploadedFile[]) =>
          prev.map((f: UploadedFile, idx: number) => (idx === fileIndex ? { ...f, status: 'uploading' } : f))
        );

        // アップロード実行（MSWでモック）
        await uploadFile(files[i], (progress) => {
          // プログレスをリアルタイムで更新
          setUploadedFiles((prev: UploadedFile[]) =>
            prev.map((f: UploadedFile, idx: number) => (idx === fileIndex ? { ...f, progress } : f))
          );
        })
          .then(() => {
            // ステータスを「成功」に更新
            setUploadedFiles((prev: UploadedFile[]) =>
              prev.map((f: UploadedFile, idx: number) => (idx === fileIndex ? { ...f, status: 'success' } : f))
            );
          })
          .catch((error) => {
            // エラー時の処理
            setUploadedFiles((prev: UploadedFile[]) =>
              prev.map((f: UploadedFile, idx: number) =>
                idx === fileIndex
                  ? {
                      ...f,
                      status: 'error',
                      error: error instanceof Error ? error.message : 'アップロードに失敗しました',
                    }
                  : f
              )
            );
          });
      }

      setIsUploading(false);
    },
    [uploadedFiles.length, addOptimisticFiles]
  );

  /**
   * ファイル削除ハンドラー（useOptimistic対応版）
   *
   * 処理フロー:
   * 1. 即座にUIから削除（楽観的更新）
   * 2. 実際の状態を更新
   *
   * 注意: サーバーへの削除リクエストは不要（クライアント側の状態のみ）
   */
  const handleFileRemove = useCallback((index: number) => {
    setUploadedFiles((prev: UploadedFile[]) => prev.filter((_: UploadedFile, i: number) => i !== index));
  }, []);

  // ================================================================================
  // ダウンロードハンドラー
  // ================================================================================

  /**
   * ファイルダウンロードハンドラー
   *
   * 処理フロー:
   * 1. ダウンロード開始（進捗0%）
   * 2. ファイルタイプに応じてBlobを生成
   * 3. 進捗をシミュレート（10ステップで100%まで）
   * 4. ダウンロード実行
   * 5. 進捗をリセット
   *
   * 注意: ダウンロードは楽観的更新の対象外
   * （ファイル生成が必要なため、即座の反映は不可能）
   */
  const handleDownload = useCallback(async (type: FileType) => {
    setIsDownloading(true);
    setDownloadProgress({ fileType: type, progress: 0 });

    const executeDownload = async () => {
      const sampleData = generateSampleData();

      // 進捗シミュレーション（実際のAPI経由の場合は不要）
      const simulateProgress = async () => {
        const progressSteps = Array.from({ length: 10 }, (_, i) => i * 10);
        for (const progress of progressSteps) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setDownloadProgress({ fileType: type, progress });
        }
      };

      const progressPromise = simulateProgress();

      // ファイルタイプに応じてBlobを生成
      const { blob, filename } = await (async (): Promise<{ blob: Blob; filename: string }> => {
        switch (type) {
          case 'csv':
            await progressPromise;

            return {
              blob: generateCsvBlob(sampleData),
              filename: generateFilename('sample_data', 'csv'),
            };

          case 'excel':
            await progressPromise;

            return {
              blob: await generateExcelBlob(sampleData),
              filename: generateFilename('sample_data', 'xlsx'),
            };

          case 'json':
            await progressPromise;

            return {
              blob: generateJsonBlob(sampleData),
              filename: generateFilename('sample_data', 'json'),
            };

          case 'text':
            await progressPromise;

            return {
              blob: generateTextBlob(sampleData),
              filename: generateFilename('sample_data', 'txt'),
            };

          case 'image':
            await progressPromise;

            return {
              blob: await generateImageBlob(),
              filename: generateFilename('sample_image', 'png'),
            };

          default:
            throw new Error('不明なファイルタイプです');
        }
      })();

      // 進捗を100%に更新
      setDownloadProgress({ fileType: type, progress: 100 });

      // ダウンロード実行
      downloadBlob(blob, filename);

      // 少し待ってから進捗をリセット
      await new Promise((resolve) => setTimeout(resolve, 500));
    };

    await executeDownload()
      .catch((error) => {
        console.error('Download failed:', error);
        alert(`ダウンロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      })
      .finally(() => {
        setIsDownloading(false);
        setDownloadProgress({ fileType: null, progress: 0 });
      });
  }, []);

  // ================================================================================
  // 戻り値
  // ================================================================================
  return {
    // Upload
    uploadedFiles: optimisticFiles, // 楽観的更新を反映したファイルリストを返す
    isUploading,
    handleFileDrop,
    handleFileRemove,
    // Download
    downloadProgress,
    isDownloading,
    handleDownload,
  };
};
