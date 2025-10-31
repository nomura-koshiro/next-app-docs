import { format } from "date-fns";
import { Workbook } from "exceljs";

import type { SampleData } from "../types";

// ================================================================================
// Sample Data Generation
// ================================================================================

/**
 * サンプルデータを生成
 *
 * デモンストレーション用の社員データを5件生成します。
 * 各データには社員の基本情報（ID、名前、メール、年齢、部署、入社日）が含まれます。
 *
 * @returns サンプルデータの配列
 *
 * @example
 * ```tsx
 * const data = generateSampleData()
 * console.log(data.length) // 5
 * ```
 */
export const generateSampleData = (): SampleData[] => {
  return [
    {
      id: 1,
      name: "山田太郎",
      email: "yamada@example.com",
      age: 28,
      department: "営業部",
      joinedDate: "2020-04-01",
    },
    {
      id: 2,
      name: "佐藤花子",
      email: "sato@example.com",
      age: 32,
      department: "開発部",
      joinedDate: "2018-07-15",
    },
    {
      id: 3,
      name: "鈴木一郎",
      email: "suzuki@example.com",
      age: 25,
      department: "人事部",
      joinedDate: "2021-10-01",
    },
    {
      id: 4,
      name: "田中美咲",
      email: "tanaka@example.com",
      age: 30,
      department: "総務部",
      joinedDate: "2019-03-20",
    },
    {
      id: 5,
      name: "高橋健太",
      email: "takahashi@example.com",
      age: 27,
      department: "開発部",
      joinedDate: "2020-09-01",
    },
  ];
};

// ================================================================================
// CSV File Generation
// ================================================================================

/**
 * CSV形式のBlobを生成
 *
 * サンプルデータをCSV形式に変換してBlobオブジェクトを作成します。
 * BOM（Byte Order Mark）付きUTF-8エンコーディングを使用することで、
 * Microsoft Excelで開いた際の文字化けを防止します。
 *
 * @param data - CSV形式に変換するサンプルデータの配列
 * @returns CSV形式のBlobオブジェクト
 *
 * @example
 * ```tsx
 * const data = generateSampleData()
 * const csvBlob = generateCsvBlob(data)
 * downloadBlob(csvBlob, 'employees.csv')
 * ```
 */
export const generateCsvBlob = (data: SampleData[]): Blob => {
  // ヘッダー行を定義
  const headers = ["ID", "名前", "メールアドレス", "年齢", "部署", "入社日"];
  const csvRows = [headers.join(",")];

  // 各データ行をCSV形式に変換
  data.forEach((item) => {
    const row = [item.id, item.name, item.email, item.age, item.department, item.joinedDate];
    csvRows.push(row.join(","));
  });

  // 全行を改行で結合
  const csvContent = csvRows.join("\n");

  // BOM付きUTF-8でBlob作成（Excelで文字化けしないように）
  return new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
};

// ================================================================================
// Excel File Generation
// ================================================================================

/**
 * Excel形式のBlobを生成
 *
 * サンプルデータをExcel形式（.xlsx）に変換してBlobオブジェクトを作成します。
 * exceljsライブラリを使用してワークブックを作成し、以下の装飾を適用します:
 * - ヘッダー行: 太字、グレー背景、中央揃え
 * - 全セル: 罫線付き
 * - 列幅: 内容に応じた適切な幅
 *
 * @param data - Excel形式に変換するサンプルデータの配列
 * @returns Excel形式のBlobオブジェクト（Promise）
 *
 * @example
 * ```tsx
 * const data = generateSampleData()
 * const excelBlob = await generateExcelBlob(data)
 * downloadBlob(excelBlob, 'employees.xlsx')
 * ```
 */
export const generateExcelBlob = async (data: SampleData[]): Promise<Blob> => {
  // ワークブックとワークシートを作成
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("社員データ");

  // 列の定義とヘッダー行のスタイル設定
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "名前", key: "name", width: 15 },
    { header: "メールアドレス", key: "email", width: 25 },
    { header: "年齢", key: "age", width: 10 },
    { header: "部署", key: "department", width: 15 },
    { header: "入社日", key: "joinedDate", width: 15 },
  ];

  // ヘッダー行のスタイル（フォント、背景色、配置）
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };
  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

  // データ行を追加
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // 全セルに罫線を追加（表形式を明確に表現）
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // ワークブックをバッファに書き込み
  const buffer = await workbook.xlsx.writeBuffer();

  // バッファからBlobを作成
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

// ================================================================================
// JSON File Generation
// ================================================================================

/**
 * JSON形式のBlobを生成
 *
 * サンプルデータをJSON形式に変換してBlobオブジェクトを作成します。
 * 人間が読みやすいようにインデント（2スペース）を付けて整形します。
 *
 * @param data - JSON形式に変換するサンプルデータの配列
 * @returns JSON形式のBlobオブジェクト
 *
 * @example
 * ```tsx
 * const data = generateSampleData()
 * const jsonBlob = generateJsonBlob(data)
 * downloadBlob(jsonBlob, 'employees.json')
 * ```
 */
export const generateJsonBlob = (data: SampleData[]): Blob => {
  // 2スペースのインデントで整形されたJSON文字列を生成
  const jsonContent = JSON.stringify(data, null, 2);

  return new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
};

// ================================================================================
// Text File Generation
// ================================================================================

/**
 * テキスト形式のBlobを生成
 *
 * サンプルデータを人間が読みやすいテキスト形式に変換してBlobオブジェクトを作成します。
 * 各社員データは装飾された枠線とともに表示され、プレーンテキストファイルとして保存できます。
 *
 * @param data - テキスト形式に変換するサンプルデータの配列
 * @returns テキスト形式のBlobオブジェクト
 *
 * @example
 * ```tsx
 * const data = generateSampleData()
 * const textBlob = generateTextBlob(data)
 * downloadBlob(textBlob, 'employees.txt')
 * ```
 */
export const generateTextBlob = (data: SampleData[]): Blob => {
  // ヘッダー部分を作成
  const lines = [
    "==========================================",
    "           社員データ一覧",
    "==========================================",
    "",
  ];

  // 各社員データをフォーマットして追加
  data.forEach((item, index) => {
    lines.push(`【社員 ${index + 1}】`);
    lines.push(`ID: ${item.id}`);
    lines.push(`名前: ${item.name}`);
    lines.push(`メールアドレス: ${item.email}`);
    lines.push(`年齢: ${item.age}歳`);
    lines.push(`部署: ${item.department}`);
    lines.push(`入社日: ${item.joinedDate}`);
    lines.push("------------------------------------------");
    lines.push("");
  });

  // 全行を改行で結合
  const textContent = lines.join("\n");

  return new Blob([textContent], { type: "text/plain;charset=utf-8;" });
};

// ================================================================================
// Image File Generation
// ================================================================================

/**
 * サンプル画像のBlobを生成
 *
 * HTML5 Canvas APIを使用して動的に画像を生成し、PNG形式のBlobオブジェクトを作成します。
 * 生成される画像は以下の要素を含みます:
 * - 紫色のグラデーション背景（#667eea → #764ba2）
 * - 中央に配置された「サンプル画像」テキスト
 * - 現在の日時タイムスタンプ
 * - 同心円状の装飾パターン
 *
 * @returns PNG形式のBlobオブジェクト（Promise）
 *
 * @example
 * ```tsx
 * const imageBlob = await generateImageBlob()
 * downloadBlob(imageBlob, 'sample.png')
 * ```
 */
export const generateImageBlob = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Canvas要素を作成（800x600ピクセル）
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    // Canvasコンテキストが取得できない場合はエラー
    if (!ctx) {
      reject(new Error("Canvas context not available"));

      return;
    }

    // 背景にグラデーションを適用
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // メインテキストを描画
    ctx.fillStyle = "white";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("サンプル画像", canvas.width / 2, canvas.height / 2 - 50);

    // タイムスタンプを描画
    ctx.font = "24px sans-serif";
    const now = new Date();
    const dateStr = format(now, "yyyy/MM/dd HH:mm:ss");
    ctx.fillText(`生成日時: ${dateStr}`, canvas.width / 2, canvas.height / 2 + 30);

    // 装飾パターン（同心円）を描画
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50 + i * 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    // CanvasをPNG形式のBlobに変換
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("画像Blobの生成に失敗しました"));
      }
    }, "image/png");
  });
};
