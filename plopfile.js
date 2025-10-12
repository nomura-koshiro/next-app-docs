/**
 * Plop Generator Configuration
 *
 * コード生成を自動化するための設定ファイル
 * - feature: 新しいfeatureを作成
 * - route: 既存のfeature内に新しいrouteを追加
 * - component: 汎用UIコンポーネントを作成
 */

export default function (plop) {
  // ヘルパー関数: PascalCaseに変換
  plop.setHelper("pascalCase", (text) => {
    return text
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toUpperCase());
  });

  // ヘルパー関数: camelCaseに変換
  plop.setHelper("camelCase", (text) => {
    return text
      .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
      .replace(/^\w/, (c) => c.toLowerCase());
  });

  // ヘルパー関数: kebab-caseに変換
  plop.setHelper("kebabCase", (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  });

  /**
   * Feature Generator
   * 新しいfeatureを完全に作成します
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
        // Schema file
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/schemas/{{kebabCase featureName}}.schema.ts",
          templateFile: "plop-templates/feature/schema.hbs",
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
        // Presentation component
        {
          type: "add",
          path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/components/{{kebabCase routeName}}-form.tsx",
          templateFile: "plop-templates/feature/route-form.hbs",
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
   * 既存のfeature内に新しいrouteを追加します
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
      // Presentation component
      {
        type: "add",
        path: "src/features/{{kebabCase featureName}}/routes/{{kebabCase routeName}}/components/{{kebabCase routeName}}-form.tsx",
        templateFile: "plop-templates/route/route-form.hbs",
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
   * 汎用UIコンポーネントを作成します
   */
  plop.setGenerator("component", {
    description: "汎用UIコンポーネントを作成します",
    prompts: [
      {
        type: "list",
        name: "componentType",
        message: "コンポーネントのタイプを選択してください:",
        choices: ["ui", "layout"],
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

      return [
        // Component
        {
          type: "add",
          path: "src/components/{{componentType}}/{{kebabCase componentName}}/{{kebabCase componentName}}.tsx",
          templateFile: "plop-templates/component/component.hbs",
        },
        // Stories（タイプに応じたテンプレートを使用）
        {
          type: "add",
          path: "src/components/{{componentType}}/{{kebabCase componentName}}/{{kebabCase componentName}}.stories.tsx",
          templateFile: storiesTemplate,
        },
        // Index
        {
          type: "add",
          path: "src/components/{{componentType}}/{{kebabCase componentName}}/index.ts",
          templateFile: "plop-templates/component/index.hbs",
        },
      ];
    },
  });
}
