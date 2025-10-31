/**
 * ファイル操作API統合エクスポート
 *
 * @module features/sample-file/api
 *
 * @description
 * ファイル操作機能のAPI関数とフックを提供。
 * ファイルのアップロード、ダウンロードなどの操作を含む。
 *
 * @example
 * ```typescript
 * import { useUploadFile, downloadFile } from '@/features/sample-file/api'
 *
 * // ファイルアップロード
 * const { mutate: uploadFile } = useUploadFile()
 * uploadFile(file)
 *
 * // ファイルダウンロード
 * await downloadFile('sample.txt', 'text/plain', 'サンプルコンテンツ')
 * ```
 */

// ================================================================================
// File API Exports
// ================================================================================

export * from "./download-file";
export * from "./upload-file";
