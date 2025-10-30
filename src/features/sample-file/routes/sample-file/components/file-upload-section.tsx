import { AlertCircle, CheckCircle2, FileIcon, Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/sample-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/sample-ui/card';

import type { UploadedFile } from '../../../types';

// ================================================================================
// Props
// ================================================================================

type FileUploadSectionProps = {
  /** アップロード済みファイルリスト */
  uploadedFiles: UploadedFile[];
  /** ファイルドロップハンドラー */
  onFileDrop: (files: File[]) => void;
  /** ファイル削除ハンドラー */
  onFileRemove: (index: number) => void;
  /** アップロード中かどうか */
  isUploading: boolean;
};

// ================================================================================
// Component
// ================================================================================

/**
 * ファイルアップロードセクション
 *
 * react-dropzone を使用したファイルアップロード機能を提供するセクションコンポーネントです。
 *
 * 機能:
 * - ドラッグ&ドロップによるファイルアップロード
 * - ファイル選択ダイアログによるアップロード
 * - アップロード進捗の表示
 * - アップロード済みファイルの一覧表示
 * - ファイルの削除機能
 * - ファイルサイズ制限（最大10MB）
 *
 * @param props - コンポーネントのプロパティ
 * @param props.uploadedFiles - アップロード済みファイルの配列
 * @param props.onFileDrop - ファイルドロップ時のコールバック関数
 * @param props.onFileRemove - ファイル削除時のコールバック関数
 * @param props.isUploading - アップロード中かどうかのフラグ
 * @returns ファイルアップロードセクションコンポーネント
 *
 * @example
 * ```tsx
 * <FileUploadSection
 *   uploadedFiles={files}
 *   onFileDrop={handleFileDrop}
 *   onFileRemove={handleFileRemove}
 *   isUploading={false}
 * />
 * ```
 */
export const FileUploadSection = ({ uploadedFiles, onFileDrop, onFileRemove, isUploading }: FileUploadSectionProps) => {
  // ================================================================================
  // Hooks
  // ================================================================================

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileDrop(acceptedFiles);
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  // 型推論のため明示的にboolean型として扱う
  const isActive: boolean = isDragActive;

  // ================================================================================
  // Helper Functions
  // ================================================================================

  /**
   * ファイルサイズをフォーマット
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /**
   * ステータスアイコンを取得
   */
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="size-5 text-red-600" />;
      case 'uploading':
        return <div className="size-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
      default:
        return <FileIcon className="size-5 text-gray-400" />;
    }
  };

  // ================================================================================
  // Render
  // ================================================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>ファイルアップロード</CardTitle>
        <CardDescription>ドラッグ&ドロップまたはクリックしてファイルを選択してください（最大10MB）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ドロップゾーン */}
        <div
          {...getRootProps()}
          className={`
            cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors
            ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <Upload className="mx-auto mb-4 size-12 text-gray-400" />
          {isActive ? (
            <p className="text-lg font-medium text-blue-600">ファイルをドロップしてください...</p>
          ) : (
            <>
              <p className="mb-2 text-lg font-medium">ファイルをドラッグ&ドロップ</p>
              <p className="text-sm text-gray-500">または</p>
              <Button type="button" variant="outline" className="mt-4" disabled={isUploading}>
                ファイルを選択
              </Button>
            </>
          )}
        </div>

        {/* アップロード済みファイルリスト */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">アップロード済みファイル ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  {/* ステータスアイコン */}
                  <div className="shrink-0">{getStatusIcon(uploadedFile.status)}</div>

                  {/* ファイル情報 */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{uploadedFile.file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                    {uploadedFile.error && <p className="text-sm text-red-600">{uploadedFile.error}</p>}
                  </div>

                  {/* 進捗バー */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="w-24 shrink-0">
                      <div className="mb-1 flex justify-between text-xs text-gray-600">
                        <span>{uploadedFile.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadedFile.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* 削除ボタン */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemove(index)}
                    disabled={uploadedFile.status === 'uploading'}
                    className="shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
