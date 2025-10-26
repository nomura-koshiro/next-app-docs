import type { Preview, Decorator } from '@storybook/nextjs-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { AppProvider } from '../src/app/provider'
import { handlers } from '../src/mocks/handlers'
import '../src/styles/globals.css'

/**
 * MSW Storybook Addon の初期化
 *
 * Storybook環境でMock Service Workerを有効にします。
 * すべてのストーリーで共通のAPIモックハンドラーを使用できます。
 *
 * @see https://github.com/mswjs/msw-storybook-addon
 */
initialize({
  onUnhandledRequest: (req) => {
    // APIリクエスト以外は警告を出さない
    if (!req.url.includes('/api/')) {
      return
    }
    console.warn('[MSW] Unhandled request:', req.method, req.url)
  },
}, handlers)

const withAppProvider: Decorator = (Story): React.ReactElement => (
  <AppProvider>
    <Story />
  </AppProvider>
)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [withAppProvider],
  loaders: [mswLoader],
}

export default preview
