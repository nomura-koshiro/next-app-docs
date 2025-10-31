import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "チャットボット | Sample App",
  description: "ChatGPTのようなチャットインターフェースのサンプルページです。",
};

export { default } from "@/features/sample-chat/routes/sample-chat";
