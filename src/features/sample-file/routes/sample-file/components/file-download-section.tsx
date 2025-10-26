import { Download, FileJson, FileSpreadsheet, FileText, Image } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/sample-ui/card';

import type { DownloadProgress, FileType } from '../../../types';

type FileDownloadSectionProps = {
  /** ダウンロードハンドラー */
  onDownload: (type: FileType) => void;
  /** ダウンロード進捗情報 */
  downloadProgress: DownloadProgress;
  /** ダウンロード中かどうか */
  isDownloading: boolean;
};

/**
 * ファイルダウンロードセクション
 *
 * 各種形式のファイルダウンロード機能を提供します。
 */
export const FileDownloadSection = ({ onDownload, downloadProgress, isDownloading }: FileDownloadSectionProps) => {
  /**
   * ダウンロードボタンの設定
   */
  const downloadButtons = [
    {
      type: 'csv' as FileType,
      label: 'CSV',
      description: 'カンマ区切りテキスト',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      type: 'excel' as FileType,
      label: 'Excel',
      description: 'スタイル付きExcel',
      icon: FileSpreadsheet,
      color: 'text-green-700',
    },
    {
      type: 'json' as FileType,
      label: 'JSON',
      description: '構造化データ',
      icon: FileJson,
      color: 'text-blue-600',
    },
    {
      type: 'text' as FileType,
      label: 'テキスト',
      description: 'プレーンテキスト',
      icon: FileText,
      color: 'text-gray-600',
    },
    {
      type: 'image' as FileType,
      label: '画像',
      description: 'サンプルPNG画像',
      icon: Image,
      color: 'text-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ファイルダウンロード</CardTitle>
        <CardDescription>各種形式でサンプルデータをダウンロードできます</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ダウンロードボタングリッド */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloadButtons.map((button) => {
            const Icon = button.icon;
            const isCurrentDownloading = isDownloading && downloadProgress.fileType === button.type;

            return (
              <button
                key={button.type}
                onClick={() => onDownload(button.type)}
                disabled={isDownloading}
                className={`
                  flex flex-col items-start gap-3 rounded-lg border-2 p-4 text-left transition-all
                  ${isDownloading ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-500 hover:bg-blue-50 active:scale-95'}
                  ${isCurrentDownloading ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
              >
                <div className="flex w-full items-center justify-between">
                  <Icon className={`size-8 ${button.color}`} />
                  {isCurrentDownloading && (
                    <div className="size-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  )}
                </div>
                <div className="w-full">
                  <h3 className="mb-1 font-semibold">{button.label}</h3>
                  <p className="text-sm text-gray-600">{button.description}</p>
                </div>

                {/* 進捗バー */}
                {isCurrentDownloading && (
                  <div className="w-full">
                    <div className="mb-1 flex justify-between text-xs text-gray-600">
                      <span>ダウンロード中...</span>
                      <span>{downloadProgress.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${downloadProgress.progress}%` }} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 説明テキスト */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-medium">
            <Download className="size-4" />
            ダウンロードについて
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• CSV: BOM付きUTF-8でExcelでも文字化けしません</li>
            <li>• Excel: exceljs使用、罫線やヘッダースタイルを設定</li>
            <li>• JSON: 整形された読みやすいJSON形式</li>
            <li>• テキスト: プレーンテキスト形式で整形済み</li>
            <li>• 画像: Canvas APIで動的生成したサンプル画像</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
