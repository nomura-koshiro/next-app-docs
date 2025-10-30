// ================================================================================
// API関数
// ================================================================================

/**
 * 実際のAPI実装の例として、進捗表示をシミュレートします。（モック実装）
 */
export const downloadFileFromApi = async (fileId: string, onProgress?: (progress: number) => void): Promise<Blob> => {
  // モック実装：進捗を段階的に更新
  return new Promise((resolve) => {
    const updateProgress = (currentProgress: number) => {
      onProgress?.(currentProgress);

      if (currentProgress >= 100) {
        // サンプルのテキストファイルを返す
        const content = `File ID: ${fileId}\nDownloaded at: ${new Date().toISOString()}`;
        const blob = new Blob([content], { type: 'text/plain' });
        resolve(blob);
      } else {
        setTimeout(() => updateProgress(currentProgress + 10), 200);
      }
    };

    updateProgress(0);
  });
};
