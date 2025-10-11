import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "./login";
import {
  loginFormSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-form.schema";

const meta = {
  title: "features/auth/routes/login/components/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ログインフォームの初期状態
 */
export const Default: Story = {
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isLoading: false,
    error: null,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    return (
      <LoginForm
        control={form.control}
        onSubmit={args.onSubmit}
        errors={form.formState.errors}
        isLoading={false}
        error={null}
      />
    );
  },
};

/**
 * 入力済み状態
 * メールアドレスとパスワードが入力されている状態
 */
export const WithValues: Story = {
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isLoading: false,
    error: null,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "user@example.com",
        password: "password123",
      },
    });

    return (
      <LoginForm
        control={form.control}
        onSubmit={args.onSubmit}
        errors={form.formState.errors}
        isLoading={false}
        error={null}
      />
    );
  },
};

/**
 * ログイン中状態
 * ログイン処理中でボタンが無効化されている状態
 */
export const Loading: Story = {
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isLoading: true,
    error: null,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "user@example.com",
        password: "password123",
      },
    });

    return (
      <LoginForm
        control={form.control}
        onSubmit={args.onSubmit}
        errors={form.formState.errors}
        isLoading={true}
        error={null}
      />
    );
  },
};

/**
 * エラー状態
 * ログインに失敗してエラーメッセージが表示されている状態
 */
export const WithError: Story = {
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isLoading: false,
    error:
      "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "user@example.com",
        password: "wrongpassword",
      },
    });

    return (
      <LoginForm
        control={form.control}
        onSubmit={args.onSubmit}
        errors={form.formState.errors}
        isLoading={false}
        error="ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      />
    );
  },
};

/**
 * バリデーションエラー状態
 * フォームのバリデーションエラーが表示されている状態
 */
export const WithValidationError: Story = {
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isLoading: false,
    error: null,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "invalid-email",
        password: "",
      },
    });
    // Trigger validation
    form.trigger();

    return (
      <LoginForm
        control={form.control}
        onSubmit={args.onSubmit}
        errors={form.formState.errors}
        isLoading={false}
        error={null}
      />
    );
  },
};
