/**
 * アップロード済みファイル情報
 */
export type UploadedFile = {
  /** ファイルオブジェクト */
  file: File;
  /** アップロード進捗（0-100） */
  progress: number;
  /** アップロード状態 */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** エラーメッセージ */
  error?: string;
};

/**
 * ファイルタイプ
 */
export type FileType = 'csv' | 'excel' | 'json' | 'text' | 'image';

/**
 * ダウンロード進捗情報
 */
export type DownloadProgress = {
  /** ダウンロード中のファイルタイプ */
  fileType: FileType | null;
  /** 進捗（0-100） */
  progress: number;
};

/**
 * サンプルデータ型
 */
export type SampleData = {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  joinedDate: string;
};
