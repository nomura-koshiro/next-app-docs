import { format } from 'date-fns';
import { Workbook } from 'exceljs';

import type { SampleData } from '../types';

/**
 * サンプルデータを生成
 */
export const generateSampleData = (): SampleData[] => {
  return [
    {
      id: 1,
      name: '山田太郎',
      email: 'yamada@example.com',
      age: 28,
      department: '営業部',
      joinedDate: '2020-04-01',
    },
    {
      id: 2,
      name: '佐藤花子',
      email: 'sato@example.com',
      age: 32,
      department: '開発部',
      joinedDate: '2018-07-15',
    },
    {
      id: 3,
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      age: 25,
      department: '人事部',
      joinedDate: '2021-10-01',
    },
    {
      id: 4,
      name: '田中美咲',
      email: 'tanaka@example.com',
      age: 30,
      department: '総務部',
      joinedDate: '2019-03-20',
    },
    {
      id: 5,
      name: '高橋健太',
      email: 'takahashi@example.com',
      age: 27,
      department: '開発部',
      joinedDate: '2020-09-01',
    },
  ];
};

/**
 * CSV形式のBlobを生成
 */
export const generateCsvBlob = (data: SampleData[]): Blob => {
  // ヘッダー行
  const headers = ['ID', '名前', 'メールアドレス', '年齢', '部署', '入社日'];
  const csvRows = [headers.join(',')];

  // データ行
  data.forEach((item) => {
    const row = [item.id, item.name, item.email, item.age, item.department, item.joinedDate];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');

  // BOM付きUTF-8でBlob作成（Excelで文字化けしないように）
  return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Excel形式のBlobを生成（exceljs使用）
 */
export const generateExcelBlob = async (data: SampleData[]): Promise<Blob> => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('社員データ');

  // ヘッダー行のスタイル設定
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: '名前', key: 'name', width: 15 },
    { header: 'メールアドレス', key: 'email', width: 25 },
    { header: '年齢', key: 'age', width: 10 },
    { header: '部署', key: 'department', width: 15 },
    { header: '入社日', key: 'joinedDate', width: 15 },
  ];

  // ヘッダー行のスタイル
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // データ追加
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // 全セルに罫線を追加
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Blobに変換
  const buffer = await workbook.xlsx.writeBuffer();

  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

/**
 * JSON形式のBlobを生成
 */
export const generateJsonBlob = (data: SampleData[]): Blob => {
  const jsonContent = JSON.stringify(data, null, 2);

  return new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
};

/**
 * テキスト形式のBlobを生成
 */
export const generateTextBlob = (data: SampleData[]): Blob => {
  const lines = [
    '==========================================',
    '           社員データ一覧',
    '==========================================',
    '',
  ];

  data.forEach((item, index) => {
    lines.push(`【社員 ${index + 1}】`);
    lines.push(`ID: ${item.id}`);
    lines.push(`名前: ${item.name}`);
    lines.push(`メールアドレス: ${item.email}`);
    lines.push(`年齢: ${item.age}歳`);
    lines.push(`部署: ${item.department}`);
    lines.push(`入社日: ${item.joinedDate}`);
    lines.push('------------------------------------------');
    lines.push('');
  });

  const textContent = lines.join('\n');

  return new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
};

/**
 * サンプル画像のBlobを生成（Canvas使用）
 */
export const generateImageBlob = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));

      return;
    }

    // 背景のグラデーション
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // テキスト描画
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('サンプル画像', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '24px sans-serif';
    const now = new Date();
    const dateStr = format(now, 'yyyy/MM/dd HH:mm:ss');
    ctx.fillText(`生成日時: ${dateStr}`, canvas.width / 2, canvas.height / 2 + 30);

    // パターン描画
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50 + i * 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    // BlobをPromiseで返す
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image blob'));
      }
    }, 'image/png');
  });
};
