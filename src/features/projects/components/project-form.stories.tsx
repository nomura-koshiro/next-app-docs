import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { useEffect } from "react";
import { type Control, useForm } from "react-hook-form";

import { type CreateProjectInput, createProjectSchema } from "@/features/projects/types/forms";

import { ProjectForm } from "./project-form";

/**
 * ProjectFormコンポーネントのストーリー
 *
 * プロジェクト情報の作成・編集フォームコンポーネント。
 * React Hook FormとZodによるバリデーションを使用しています。
 *
 * @example
 * ```tsx
 * const { control, handleSubmit, formState } = useForm<CreateProjectInput>({
 *   resolver: zodResolver(createProjectSchema),
 * });
 *
 * <ProjectForm
 *   control={control}
 *   onSubmit={handleSubmit(onSubmit)}
 *   onCancel={onCancel}
 *   errors={formState.errors}
 *   isSubmitting={formState.isSubmitting}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/projects/components/ProjectForm",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ProjectForm,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "padded",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "プロジェクト情報の作成・編集を行うフォームコンポーネント。\n\n" +
          "**主な機能:**\n" +
          "- React Hook Formによるフォーム管理\n" +
          "- Zodスキーマによるバリデーション\n" +
          "- プロジェクト名、説明、ステータスの入力\n" +
          "- 送信中状態の制御\n" +
          "- エラーメッセージの表示\n" +
          "- 新規作成・編集モードの切り替え\n\n" +
          "**使用場面:**\n" +
          "- 新規プロジェクト作成画面\n" +
          "- プロジェクト情報編集画面",
      },
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],

  // ================================================================================
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    control: {
      description: "React Hook Formのcontrolオブジェクト",
      table: {
        type: { summary: "Control<CreateProjectInput>" },
        category: "フォーム制御",
      },
    },
    onSubmit: {
      description: "フォーム送信時のコールバック関数",
      table: {
        type: { summary: "(e?: React.BaseSyntheticEvent) => Promise<void>" },
        category: "イベント",
      },
    },
    onCancel: {
      description: "キャンセルボタン押下時のコールバック関数",
      table: {
        type: { summary: "() => void" },
        category: "イベント",
      },
    },
    errors: {
      description: "React Hook Formのエラーオブジェクト",
      table: {
        type: { summary: "FieldErrors<CreateProjectInput>" },
        category: "フォーム制御",
      },
    },
    isSubmitting: {
      control: "boolean",
      description: "送信中状態のフラグ",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "状態",
      },
    },
    isEditMode: {
      control: "boolean",
      description: "編集モードのフラグ（新規作成 or 編集）",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "状態",
      },
    },
  },
} satisfies Meta<typeof ProjectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 新規プロジェクト作成フォームの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "",
        description: "",
        is_active: true,
      },
    });

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: "新規プロジェクト作成時の初期状態。プロジェクト名と説明が空で、ステータスはアクティブにチェックされています。",
      },
    },
  },
};

/**
 * 入力済み状態
 * フォームに値が入力されている状態
 */
export const WithValue: Story = {
  name: "入力済み",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "新規プロジェクト",
        description: "これは新規プロジェクトの説明です。プロジェクトの目的や概要を記載します。",
        is_active: true,
      },
    });

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: "すべてのフィールドに有効な値が入力された状態。送信ボタンが有効になります。",
      },
    },
  },
};

/**
 * バリデーションエラー状態
 * フォームバリデーションエラーが表示されている状態
 */
export const ValidationError: Story = {
  name: "バリデーションエラー",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
      trigger,
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "",
        description: "",
        is_active: true,
      },
    });

    // エラーを表示するために初期バリデーションを実行
    useEffect(() => {
      void trigger();
    }, [trigger]);

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story:
          "必須フィールド（プロジェクト名）が空のままフォーム送信を試みた際のバリデーションエラー表示。フィールドの下にエラーメッセージが表示されます。",
      },
    },
  },
};

/**
 * 送信中状態
 * フォーム送信中でボタンが無効化されている状態
 */
export const Submitting: Story = {
  name: "送信中",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: true,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "新規プロジェクト",
        description: "プロジェクトの説明",
        is_active: true,
      },
    });

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={true} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: "フォーム送信中の状態。送信ボタンとキャンセルボタンが無効化され、ボタンに「作成中...」と表示されます。",
      },
    },
  },
};

/**
 * エラー状態
 * API通信エラーが表示されている状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "新規プロジェクト",
        description: "プロジェクトの説明",
        is_active: true,
      },
    });

    const errors = {
      root: {
        message: "プロジェクトの作成に失敗しました",
        type: "manual",
      },
    };

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: "API通信エラーなど、サーバー側でエラーが発生した際の表示。フォーム上部にエラーメッセージが表示されます。",
      },
    },
  },
};

/**
 * 編集モード
 * プロジェクト編集フォームの通常状態
 */
export const EditMode: Story = {
  name: "編集モード",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
    isEditMode: true,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "既存プロジェクト",
        description: "既存プロジェクトの説明を編集しています。",
        is_active: true,
      },
    });

    return (
      <ProjectForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    );
  },
  play: async () => {
    // ストーリーの表示のみを目的としているため、特別なテストは不要
  },
  parameters: {
    docs: {
      description: {
        story: "既存プロジェクト情報を編集する際のモード。ボタンラベルが「作成」から「更新」に変わります。",
      },
    },
  },
};

/**
 * 非アクティブプロジェクト
 * ステータスが非アクティブの状態
 */
export const InactiveProject: Story = {
  name: "非アクティブプロジェクト",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "非アクティブプロジェクト",
        description: "このプロジェクトは現在非アクティブです。",
        is_active: false,
      },
    });

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: "ステータスが非アクティブに設定されているプロジェクトのフォーム状態。アクティブチェックボックスがオフになっています。",
      },
    },
  },
};

/**
 * 長い説明文
 * 説明フィールドに長いテキストが入力されている状態
 */
export const WithLongDescription: Story = {
  name: "長い説明文",
  args: {
    control: {} as Control<CreateProjectInput>,
    onSubmit: fn(),
    onCancel: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "大規模プロジェクト",
        description:
          "これは非常に長い説明文を持つプロジェクトです。プロジェクトの背景、目的、スコープ、期待される成果物、チームメンバー、スケジュール、リスク、前提条件などの詳細情報を含みます。このプロジェクトは複数のフェーズに分かれており、各フェーズで異なる成果物が期待されています。第一フェーズでは要件定義と基本設計を行い、第二フェーズで詳細設計と実装を行います。",
        is_active: true,
      },
    });

    return <ProjectForm control={control} onSubmit={handleSubmit(fn())} onCancel={fn()} errors={errors} isSubmitting={isSubmitting} />;
  },
  parameters: {
    docs: {
      description: {
        story: "説明フィールドに長いテキストが入力された状態。テキストエリアが複数行にわたって表示されます。",
      },
    },
  },
};
