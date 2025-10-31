import { format } from "date-fns";
import { saveAs } from "file-saver";

import { api } from "@/lib/api-client";
import { logger } from "@/utils/logger";

// ================================================================================
// Blob Download
// ================================================================================

/**
 * Blobをファイルとしてダウンロード
 *
 * file-saverライブラリを使用してBlobオブジェクトをローカルファイルとして保存します。
 * ブラウザのダウンロード機能を自動的にトリガーします。
 *
 * @param blob - ダウンロードするBlobオブジェクト
 * @param filename - 保存するファイル名（拡張子を含む）
 *
 * @example
 * ```tsx
 * const blob = new Blob(['Hello World'], { type: 'text/plain' })
 * downloadBlob(blob, 'hello.txt')
 * ```
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  saveAs(blob, filename);
};

// ================================================================================
// Filename Generation
// ================================================================================

/**
 * タイムスタンプ付きファイル名を生成
 *
 * ベース名と拡張子を受け取り、現在の日時をタイムスタンプとして含むファイル名を生成します。
 * タイムスタンプの形式は「yyyyMMdd_HHmmss」（例: 20240315_143025）です。
 * 同じ名前のファイルが重複しないようにするのに便利です。
 *
 * @param baseName - ファイル名のベース部分（例: "employees"）
 * @param extension - ファイルの拡張子（例: "csv"、ドット不要）
 * @returns タイムスタンプ付きのファイル名（例: "employees_20240315_143025.csv"）
 *
 * @example
 * ```tsx
 * const filename = generateFilename('report', 'pdf')
 * console.log(filename) // "report_20240315_143025.pdf"
 * ```
 */
export const generateFilename = (baseName: string, extension: string): string => {
  // 現在時刻をフォーマット（yyyyMMdd_HHmmss形式）
  const timestamp = format(new Date(), "yyyyMMdd_HHmmss");

  return `${baseName}_${timestamp}.${extension}`;
};

// ================================================================================
// API Download
// ================================================================================

/**
 * API経由でファイルをダウンロード
 *
 * 指定されたURLからファイルをダウンロードし、ローカルに保存します。
 * ダウンロード進捗をコールバック関数で通知することができるため、
 * プログレスバーなどのUI更新に利用できます。
 *
 * 内部的にはAxiosを使用してBlobデータを取得し、file-saverで保存します。
 * エラーが発生した場合はログに記録し、エラーを再スローします。
 *
 * @param url - ダウンロードするファイルのURL
 * @param filename - 保存するファイル名
 * @param onProgress - ダウンロード進捗を通知するコールバック関数（省略可能）
 *                     パーセンテージ（0-100）を引数として受け取ります
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * await downloadFromApi('/api/files/report.pdf', 'report.pdf')
 *
 * // 進捗表示付き
 * await downloadFromApi(
 *   '/api/files/large-file.zip',
 *   'data.zip',
 *   (progress) => {
 *     console.log(`ダウンロード進捗: ${progress}%`)
 *   }
 * )
 * ```
 */
export const downloadFromApi = async (url: string, filename: string, onProgress?: (progress: number) => void): Promise<void> => {
  const blob = await api
    .get(url, {
      responseType: "blob",
      // ダウンロード進捗を監視
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total != null && progressEvent.total > 0) {
          // パーセンテージを計算（0-100の整数値）
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    })
    .catch((error) => {
      logger.error("ダウンロードに失敗しました", error);
      throw error;
    });

  // 取得したBlobをファイルとしてダウンロード
  downloadBlob(blob as unknown as Blob, filename);
};
