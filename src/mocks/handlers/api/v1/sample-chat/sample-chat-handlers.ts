/**
 * サンプルチャットAPI用のMSWハンドラー
 */

import { delay, http, HttpResponse } from "msw";

import type { Message, SendMessageInput, SendMessageOutput } from "@/features/sample-chat/types";

/**
 * アシスタントの返信候補
 */
const assistantResponses = [
  "こんにちは！何かお手伝いできることはありますか？",
  "それは興味深いですね。もう少し詳しく教えていただけますか？",
  "なるほど、よくわかりました。他に質問はありますか？",
  "素晴らしい質問ですね。それについて説明させていただきます。",
  "もちろんです！喜んでお答えします。",
  "お役に立てて嬉しいです。他に何かご質問はありますか？",
  "それは良いアイデアですね！",
  "承知しました。それでは進めていきましょう。",
];

/**
 * ユーザーメッセージに基づいて適切な返信を生成
 */
const generateResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("こんにちは") || lowerMessage.includes("hello")) {
    return "こんにちは！何かお手伝いできることはありますか？";
  }

  if (lowerMessage.includes("ありがとう") || lowerMessage.includes("thanks")) {
    return "どういたしまして！他に何かお手伝いできることはありますか？";
  }

  if (lowerMessage.includes("?") || lowerMessage.includes("？")) {
    return "それは興味深い質問ですね。詳しく説明させていただきます。このサンプルはMSWを使用したモック実装です。実際のアプリケーションでは、ここで実際のAI APIを呼び出すことになります。";
  }

  // ランダムに返信を選択
  const randomIndex = Math.floor(Math.random() * assistantResponses.length);

  return assistantResponses[randomIndex];
};

const messageIdState = { current: 1 };
const conversationId = "conv-1";

export const sampleChatHandlers = [
  /**
   * POST /api/v1/sample/chat/messages
   * メッセージ送信とアシスタントからの返信取得
   */
  http.post("*/api/v1/sample/chat/messages", async ({ request }) => {
    // 回答生成をシミュレートするため遅延を追加
    await delay(1500);

    const body = (await request.json()) as SendMessageInput;

    // アシスタントからの返信を生成
    const responseContent = generateResponse(body.message);

    const messageId = messageIdState.current;
    messageIdState.current += 1;

    const assistantMessage: Message = {
      id: String(messageId),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    };

    const response: SendMessageOutput = {
      message: assistantMessage,
      conversationId: body.conversationId ?? conversationId,
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
