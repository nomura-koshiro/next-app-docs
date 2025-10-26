/**
 * サンプルファイルAPI用のMSWハンドラー
 */

import { delay, http, HttpResponse } from 'msw';

import type { UploadFileResponse } from '@/features/sample-file/api';

// アップロードされたファイルの情報を保持
const uploadedFiles: Array<{
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
  content: string;
}> = [];

export const fileHandlers = [
  /**
   * POST /api/v1/sample/files/upload
   * ファイルアップロード
   */
  http.post('*/api/v1/sample/files/upload', async ({ request }) => {
    // 進捗シミュレーションのため遅延を追加
    await delay(1500);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return HttpResponse.json(
        {
          message: 'No file provided',
        },
        { status: 400 }
      );
    }

    // ファイル情報を保存
    const fileId = String(uploadedFiles.length + 1);
    const fileInfo = {
      id: fileId,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      content: await file.text(),
    };

    uploadedFiles.push(fileInfo);

    const response: UploadFileResponse = {
      id: fileInfo.id,
      filename: fileInfo.filename,
      size: fileInfo.size,
      uploadedAt: fileInfo.uploadedAt,
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  /**
   * GET /api/v1/sample/files/:id
   * ファイルダウンロード
   */
  http.get('*/api/v1/sample/files/:id', async ({ params }) => {
    // 進捗シミュレーションのため遅延を追加
    await delay(1500);

    const { id } = params;
    const file = uploadedFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          message: 'File not found',
        },
        { status: 404 }
      );
    }

    // ファイル内容をBlobとして返す
    const blob = new Blob([file.content], { type: 'text/plain' });

    return HttpResponse.arrayBuffer(await blob.arrayBuffer(), {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${file.filename}"`,
      },
    });
  }),

  /**
   * GET /api/v1/sample/files
   * アップロード済みファイル一覧取得
   */
  http.get('*/api/v1/sample/files', () => {
    return HttpResponse.json({
      data: uploadedFiles.map((f) => ({
        id: f.id,
        filename: f.filename,
        size: f.size,
        uploadedAt: f.uploadedAt,
      })),
    });
  }),
];
