/**
 * グローバル型定義
 *
 * TypeScriptが認識できないモジュールの型定義を提供します。
 */

/**
 * CSSモジュールの型定義
 * .css ファイルのインポートを許可
 */
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

/**
 * SCSSモジュールの型定義
 * .scss ファイルのインポートを許可
 */
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

/**
 * 画像ファイルの型定義
 */
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}
