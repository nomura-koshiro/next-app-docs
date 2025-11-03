/**
 * ファイル操作機能の型定義
 *
 * @module features/sample-file/types
 */

/**
 * アップロード済みファイル情報を表す型
 *
 * @property file - ブラウザのFileオブジェクト
 * @property progress - アップロード進捗率（0-100）
 * @property status - アップロード状態
 *   - pending: アップロード待機中
 *   - uploading: アップロード中
 *   - success: アップロード成功
 *   - error: アップロード失敗
 * @property error - エラーメッセージ（エラー時のみ）
 *
 * @example
 * ```typescript
 * const uploadedFile: UploadedFile = {
 *   file: new File(['content'], 'example.txt'),
 *   progress: 75,
 *   status: 'uploading'
 * }
 * ```
 */
export type UploadedFile = {
  /** ファイルオブジェクト */
  file: File;
  /** アップロード進捗（0-100） */
  progress: number;
  /** アップロード状態 */
  status: "pending" | "uploading" | "success" | "error";
  /** エラーメッセージ */
  error?: string;
};

/**
 * ファイルタイプを表す型
 *
 * - csv: CSVファイル
 * - excel: Excelファイル（.xlsx）
 * - json: JSONファイル
 * - text: テキストファイル
 * - image: 画像ファイル
 *
 * @example
 * ```typescript
 * const fileType: FileType = 'csv'
 * ```
 */
export type FileType = "csv" | "excel" | "json" | "text" | "image";

/**
 * ダウンロード進捗情報を表す型
 *
 * @property fileType - ダウンロード中のファイルタイプ（ダウンロードしていない場合はnull）
 * @property progress - ダウンロード進捗率（0-100）
 *
 * @example
 * ```typescript
 * const downloadProgress: DownloadProgress = {
 *   fileType: 'csv',
 *   progress: 50
 * }
 * ```
 */
export type DownloadProgress = {
  /** ダウンロード中のファイルタイプ */
  fileType: FileType | null;
  /** 進捗（0-100） */
  progress: number;
};

/**
 * サンプルデータを表す型
 *
 * @property id - データID
 * @property name - 名前
 * @property email - メールアドレス
 * @property age - 年齢
 * @property department - 部署名
 * @property joinedDate - 入社日（ISO 8601形式の文字列）
 *
 * @example
 * ```typescript
 * const sampleData: SampleData = {
 *   id: 1,
 *   name: '山田太郎',
 *   email: 'yamada@example.com',
 *   age: 30,
 *   department: '開発部',
 *   joinedDate: '2020-04-01'
 * }
 * ```
 */
export type SampleData = {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  joinedDate: string;
};
