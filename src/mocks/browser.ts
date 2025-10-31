import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

/**
 * MSW Browser Worker
 *
 * ブラウザ環境用のMock Service Workerインスタンス。
 * handlers.tsで定義されたリクエストハンドラーを使用して、
 * ブラウザ内でAPIリクエストをインターセプトします。
 *
 * @see https://mswjs.io/docs/api/setup-worker
 */
export const worker = setupWorker(...handlers);
