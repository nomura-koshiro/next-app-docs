/**
 * Plop Generator Configuration
 *
 * コード生成を自動化するための設定ファイル
 *
 * 利用可能なジェネレーター:
 * - feature: 新しいfeatureを作成（スキーマ、ルート、フック、コンポーネント、ストーリー）
 * - route: 既存のfeature内に新しいrouteを追加
 * - component: 汎用UIコンポーネントまたはレイアウトコンポーネントを作成
 * - app-page: Next.js App Routerのページファイルを作成
 *
 * 使用方法:
 * ```bash
 * pnpm generate:feature   # Feature生成
 * pnpm generate:route     # Route生成
 * pnpm generate:component # Component生成
 * pnpm generate:app-page  # App Routerページ生成
 * ```
 */

export default function (plop) {
  // ================================================================================
  // Helper Functions
  // ================================================================================

  /**
   * PascalCaseに変換するヘルパー関数
   * @example "user-list" -> "UserList"
   */
  plop.setHelper("pascalCase", (text) => {
    return text
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toUpperCase());
  });

  /**
   * camelCaseに変換するヘルパー関数
   * @example "user-list" -> "userList"
   */
  plop.setHelper("camelCase", (text) => {
    return text
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toLowerCase());
  });

  /**
   * kebab-caseに変換するヘルパー関数
   * @example "UserList" -> "user-list"
   */
  plop.setHelper("kebabCase", (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  });

  // ================================================================================
  // Generators
  // ================================================================================

  /**
   * Feature Generator
   *
   * 新しいfeatureを完全に作成します。
   *
   * 生成されるファイル:
   * - api/ - API関連のファイル（get, create, update, delete）
   * - types/ - 型定義
   * - schemas/ - バリデーションスキーマ
   * - components/ - feature共有コンポーネント
   * - routes/{{routeName}}/ - 最初のルート
   * - index.ts - Featureエクスポート
   */
  plop.setGenerator("feature", {
    description: "新しいfeatureを作成します",
    prompts: [
      {
        type: "input",
        name: "featureName",
        message: "Feature名を入力してください (例: blog, product):",
        validate: (value) => {
          if (!value) return "Feature名は必須です";
          if (!/^[a-z][a-z0-9-]*$/.test(value))
            return "小文字とハイフンのみ使用できます (例: blog-post)";
          return true;
        },
      },
      {
        type: "input",
        name: "routeName",
        message:
          "Route名を入力してください (例: list, detail) [デフォルト: featureName]:",
      },
    ],
    actions: (data) => {
      const routeName = data.routeName || data.featureName;
      data.routeName = routeName;

      return [
        // API files
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/get-{{kebabCase featureName}}s.ts",
          templateFile: "plop-templates/feature/api-get-list.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/get-{{kebabCase featureName}}.ts",
          templateFile: "plop-templates/feature/api-get-single.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/create-{{kebabCase featureName}}.ts",
          templateFile: "plop-templates/feature/api-create.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/update-{{kebabCase featureName}}.ts",
          templateFile: "plop-templates/feature/api-update.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/delete-{{kebabCase featureName}}.ts",
          templateFile: "plop-templates/feature/api-delete.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/api/index.ts",
          templateFile: "plop-templates/feature/api-index.hbs",
        },
        // Types file
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/types/index.ts",
          templateFile: "plop-templates/feature/types-index.hbs",
        },
        // Schema file
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/schemas/{{kebabCase featureName}}.schema.ts",
          templateFile: "plop-templates/feature/schema.hbs",
        },
        // Feature-level shared components
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/components/{{kebabCase featureName}}-form.tsx",
          templateFile: "plop-templates/feature/feature-form.hbs",
        },
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/components/{{kebabCase featureName}}-form.stories.tsx",
          templateFile: "plop-templates/feature/feature-form-stories.hbs",
        },
        // Route container
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.tsx",
          templateFile: "plop-templates/feature/route-container.hbs",
        },
        // Route hook
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.hook.ts",
          templateFile: "plop-templates/feature/route-hook.hbs",
        },
        // Route stories
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.stories.tsx",
          templateFile: "plop-templates/feature/route-stories.hbs",
        },
        // Route index
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/index.ts",
          templateFile: "plop-templates/feature/route-index.hbs",
        },
        // Feature index
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/index.ts",
          templateFile: "plop-templates/feature/feature-index.hbs",
        },
      ];
    },
  });

  /**
   * Route Generator
   *
   * 既存のfeature内に新しいrouteを追加します。
   *
   * 生成されるファイル:
   * - routes/{{routeName}}/{{routeName}}.tsx - ページコンポーネント
   * - routes/{{routeName}}/{{routeName}}.hook.ts - カスタムフック
   * - routes/{{routeName}}/{{routeName}}.stories.tsx - Storybookストーリー
   * - routes/{{routeName}}/index.ts - エクスポート
   *
   * 注意: feature直下の共有コンポーネントを使用することを想定しています。
   * ルート固有のコンポーネントが必要な場合は、手動でcomponents/ディレクトリを作成してください。
   */
  plop.setGenerator("route", {
    description: "既存のfeature内に新しいrouteを追加します",
    prompts: [
      {
        type: "input",
        name: "featureName",
        message: "既存のFeature名を入力してください:",
        validate: (value) => {
          if (!value) return "Feature名は必須です";
          return true;
        },
      },
      {
        type: "input",
        name: "routeName",
        message: "新しいRoute名を入力してください (例: list, detail):",
        validate: (value) => {
          if (!value) return "Route名は必須です";
          if (!/^[a-z][a-z0-9-]*$/.test(value))
            return "小文字とハイフンのみ使用できます";
          return true;
        },
      },
    ],
    actions: [
      // Route container
      {
        type: "add",
        path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.tsx",
        templateFile: "plop-templates/route/route-container.hbs",
      },
      // Route hook
      {
        type: "add",
        path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.hook.ts",
        templateFile: "plop-templates/route/route-hook.hbs",
      },
      // Route stories
      {
        type: "add",
        path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/{{kebabCase routeName}}.stories.tsx",
        templateFile: "plop-templates/route/route-stories.hbs",
      },
      // Route index
      {
        type: "add",
        path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/index.ts",
        templateFile: "plop-templates/route/route-index.hbs",
      },
    ],
  });

  /**
   * Component Generator
   *
   * 汎用UIコンポーネントまたはレイアウトコンポーネントを作成します。
   *
   * 生成されるファイル:
   * - ui: components/ui/{{componentName}}/{{componentName}}.tsx （サブディレクトリ付き）
   * - layout: components/layout/{{componentName}}.tsx （直接配置、サブディレクトリなし）
   *
   * コンポーネントタイプ:
   * - ui: 汎用UIコンポーネント（ボタン、インプットなど）→ サブディレクトリ構造
   * - layout: レイアウトコンポーネント（ヘッダー、フッターなど）→ フラット構造
   */
  plop.setGenerator("component", {
    description: "汎用UIコンポーネントを作成します",
    prompts: [
      {
        type: "list",
        name: "componentType",
        message: "コンポーネントのタイプを選択してください:",
        choices: [
          { name: "UI Component (ui)", value: "ui" },
          { name: "Layout Component (layout)", value: "layout" },
        ],
      },
      {
        type: "input",
        name: "componentName",
        message:
          "コンポーネント名を入力してください (例: modal, dropdown):",
        validate: (value) => {
          if (!value) return "コンポーネント名は必須です";
          if (!/^[a-z][a-z0-9-]*$/.test(value))
            return "小文字とハイフンのみ使用できます";
          return true;
        },
      },
    ],
    actions: (data) => {
      // componentTypeに応じてストーリーテンプレートを選択
      const storiesTemplate =
        data.componentType === "layout"
          ? "plop-templates/component/stories-layout.hbs"
          : "plop-templates/component/stories-ui.hbs";

      // layoutコンポーネントはフラット構造、uiコンポーネントはサブディレクトリ構造
      if (data.componentType === "layout") {
        return [
          // Component (直接配置)
          {
            type: "add",
            path: "src/components/layout/{{kebabCase componentName}}.tsx",
            templateFile: "plop-templates/component/component.hbs",
          },
          // Stories (直接配置)
          {
            type: "add",
            path: "src/components/layout/{{kebabCase componentName}}.stories.tsx",
            templateFile: storiesTemplate,
          },
        ];
      } else {
        return [
          // Component (サブディレクトリ)
          {
            type: "add",
            path: "src/components/ui/{{kebabCase componentName}}/{{kebabCase componentName}}.tsx",
            templateFile: "plop-templates/component/component.hbs",
          },
          // Stories (サブディレクトリ)
          {
            type: "add",
            path: "src/components/ui/{{kebabCase componentName}}/{{kebabCase componentName}}.stories.tsx",
            templateFile: storiesTemplate,
          },
          // Index (uiコンポーネントのみ)
          {
            type: "add",
            path: "src/components/ui/{{kebabCase componentName}}/index.ts",
            templateFile: "plop-templates/component/index.hbs",
          },
        ];
      }
    },
  });

  /**
   * App Page Generator
   *
   * Next.js App Routerのページファイル（page.tsx）を作成します。
   * 既存のfeature/routeを参照してApp Routerのページを追加します。
   *
   * 生成されるファイル:
   * - app/{{path}}/page.tsx - ページファイル（metadataとfeature export）
   * - app/{{path}}/loading.tsx - ローディング状態（オプション）
   *
   * 注意: 先にfeatureとrouteを作成してから、このジェネレーターを使用してください。
   */
  plop.setGenerator("app-page", {
    description: "Next.js App Routerのページファイルを作成します",
    prompts: [
      {
        type: "input",
        name: "featureName",
        message: "既存のFeature名を入力してください:",
        validate: (value) => {
          if (!value) return "Feature名は必須です";
          return true;
        },
      },
      {
        type: "input",
        name: "routeName",
        message: "既存のRoute名を入力してください:",
        validate: (value) => {
          if (!value) return "Route名は必須です";
          return true;
        },
      },
      {
        type: "input",
        name: "appPath",
        message:
          "App Routerのパスを入力してください (例: sample-users, sample-users/[id]/edit):",
        validate: (value) => {
          if (!value) return "パスは必須です";
          return true;
        },
      },
      {
        type: "input",
        name: "title",
        message: "ページタイトルを入力してください (例: ユーザー一覧):",
        validate: (value) => {
          if (!value) return "タイトルは必須です";
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "ページ説明を入力してください:",
        validate: (value) => {
          if (!value) return "説明は必須です";
          return true;
        },
      },
      {
        type: "confirm",
        name: "includeLoading",
        message: "loading.tsxを作成しますか?",
        default: false,
      },
    ],
    actions: (data) => {
      const actions = [
        // Page file
        {
          type: "add",
          path: "src/app/(sample)/{{appPath}}/page.tsx",
          templateFile: "plop-templates/app-page/page.hbs",
        },
      ];

      // loading.tsxを含める場合
      if (data.includeLoading) {
        actions.push({
          type: "add",
          path: "src/app/(sample)/{{appPath}}/loading.tsx",
          templateFile: "plop-templates/app-page/loading.hbs",
        });
      }

      return actions;
    },
  });
}
