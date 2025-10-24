// ================================================================================
// API Functions
// ================================================================================

/**
 * API経由でファイルをダウンロード（モック実装）
 *
 * 実際のAPI実装の例として、進捗表示をシミュレートします。
 *
 * @param fileId - ダウンロードするファイルID
 * @param onProgress - ダウンロード進捗コールバック（0-100）
 * @returns ダウンロードしたBlob
 */
export const downloadFileFromApi = async (fileId: string, onProgress?: (progress: number) => void): Promise<Blob> => {
  // モック実装：進捗を段階的に更新
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress?.(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // サンプルのテキストファイルを返す
        const content = `File ID: ${fileId}\nDownloaded at: ${new Date().toISOString()}`;
        const blob = new Blob([content], { type: 'text/plain' });
        resolve(blob);
      }
    }, 200);
  });
};
