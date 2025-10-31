/**
 * サンプルページの情報
 */
export type SampleItem = {
  title: string;
  description: string;
  href: string;
  category: string;
};

/**
 * サンプルページ一覧
 */
export const SAMPLES: SampleItem[] = [
  {
    title: "フォームサンプル",
    description:
      "React Hook FormとZodを使用した包括的なフォームサンプル。テキスト入力、セレクト、チェックボックス、ラジオボタン、スイッチ、日付入力など、様々なフォーム要素の実装例を確認できます。",
    href: "/sample-form",
    category: "フォーム",
  },
  {
    title: "ログイン",
    description:
      "認証機能のサンプル実装。メールアドレスとパスワードによるログインフォーム、バリデーション、エラーハンドリングの実装例です。",
    href: "/sample-login",
    category: "認証",
  },
  {
    title: "ユーザー一覧",
    description:
      "データ一覧表示のサンプル。TanStack Queryを使用したデータフェッチ、ローディング状態、エラーハンドリング、空の状態の表示などを実装しています。",
    href: "/sample-users",
    category: "ユーザー管理",
  },
  {
    title: "ユーザー新規作成",
    description: "新規データ作成フォームのサンプル。バリデーション、送信処理、エラーハンドリング、成功時のリダイレクトなどの実装例です。",
    href: "/sample-users/new",
    category: "ユーザー管理",
  },
  {
    title: "ユーザー編集",
    description: "既存データの編集フォームのサンプル。データの取得、フォームへの初期値設定、更新処理、楽観的更新の実装例です。",
    href: "/sample-users/1/edit",
    category: "ユーザー管理",
  },
  {
    title: "ユーザー削除",
    description: "データ削除機能のサンプル。削除確認ダイアログ、削除処理、エラーハンドリング、成功時のリダイレクトなどの実装例です。",
    href: "/sample-users/1/delete",
    category: "ユーザー管理",
  },
  {
    title: "ファイルアップロード・ダウンロード",
    description:
      "react-dropzoneとfile-saverを使用したファイル操作のサンプル。ドラッグ&ドロップでのファイルアップロード、CSV・Excel・JSON・テキスト・画像のダウンロード、進捗表示などの実装例です。",
    href: "/sample-file",
    category: "ファイル操作",
  },
  {
    title: "チャットボット",
    description:
      "ChatGPTのようなチャットインターフェースのサンプル。メッセージの送受信、送信中の状態管理、自動スクロール、MSWを使用したモック実装などを含みます。",
    href: "/sample-chat",
    category: "チャット",
  },
];
