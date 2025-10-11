import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserForm } from "./user-form";
import {
  userFormSchema,
  type UserFormValues,
} from "@/features/sample-users/schemas/user-form.schema";

const meta = {
  title: "features/users/components/UserForm",
  component: UserForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * 新規ユーザー作成フォームの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "",
        email: "",
        role: "user",
      },
    });

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    );
  },
};

/**
 * 入力済み状態
 * フォームに値が入力されている状態
 */
export const WithValue: Story = {
  name: "入力済み",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "山田太郎",
        email: "yamada@example.com",
        role: "admin",
      },
    });

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    );
  },
};

/**
 * バリデーションエラー状態
 * フォームバリデーションエラーが表示されている状態
 */
export const ValidationError: Story = {
  name: "バリデーションエラー",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "",
        email: "",
        role: "user",
      },
    });

    // エラーを表示するために初期バリデーションを実行
    trigger();

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    );
  },
};

/**
 * 送信中状態
 * フォーム送信中でボタンが無効化されている状態
 */
export const Submitting: Story = {
  name: "送信中",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "山田太郎",
        email: "yamada@example.com",
        role: "user",
      },
    });

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={true}
      />
    );
  },
};

/**
 * エラー状態
 * API通信エラーが表示されている状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "山田太郎",
        email: "yamada@example.com",
        role: "user",
      },
    });

    const errors = {
      root: {
        message: "ユーザーの作成に失敗しました",
        type: "manual",
      },
    };

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    );
  },
};

/**
 * 編集モード
 * ユーザー編集フォームの通常状態
 */
export const EditMode: Story = {
  name: "編集モード",
  args: {
    control: {} as Control<UserFormValues>,
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
    } = useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name: "山田太郎",
        email: "yamada@example.com",
        role: "admin",
      },
    });

    return (
      <UserForm
        control={control}
        onSubmit={handleSubmit(fn())}
        onCancel={fn()}
        errors={errors}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    );
  },
};

