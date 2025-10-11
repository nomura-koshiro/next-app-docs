import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormField, InputField, SelectField } from "./form-field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const meta = {
  title: "components/ui/FormField",
  component: FormField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なFormField
 */
export const Default: Story = {
  args: {
    label: "ラベル",
    id: "field1",
    children: <Input placeholder="入力してください" />,
  },
  render: () => (
    <FormField label="ラベル" id="field1">
      <Input placeholder="入力してください" />
    </FormField>
  ),
};

/**
 * 必須フィールド
 */
export const Required: Story = {
  args: {
    label: "名前",
    id: "name",
    required: true,
    children: <Input placeholder="山田太郎" required />,
  },
  render: () => (
    <FormField label="名前" id="name" required>
      <Input placeholder="山田太郎" required />
    </FormField>
  ),
};

/**
 * エラー付きフィールド
 */
export const WithError: Story = {
  args: {
    label: "メールアドレス",
    id: "email",
    required: true,
    error: "有効なメールアドレスを入力してください",
    children: (
      <Input type="email" placeholder="user@example.com" aria-invalid="true" />
    ),
  },
  render: () => (
    <FormField
      label="メールアドレス"
      id="email"
      required
      error="有効なメールアドレスを入力してください"
    >
      <Input type="email" placeholder="user@example.com" aria-invalid="true" />
    </FormField>
  ),
};

/**
 * InputField コンポーネント
 */
export const InputFieldExample: Story = {
  args: {
    label: "ユーザー名",
    id: "username",
    children: <Input />,
  },
  render: () => {
    const [value, setValue] = useState("");

    return (
      <InputField
        label="ユーザー名"
        id="username"
        value={value}
        onChange={setValue}
        placeholder="username"
        required
      />
    );
  },
};

/**
 * SelectField コンポーネント
 */
export const SelectFieldExample: Story = {
  args: {
    label: "ロール",
    id: "role",
    children: <Input />,
  },
  render: () => {
    const [value, setValue] = useState("");

    return (
      <SelectField
        label="ロール"
        id="role"
        value={value}
        onChange={setValue}
        options={[
          { value: "user", label: "ユーザー" },
          { value: "admin", label: "管理者" },
          { value: "moderator", label: "モデレーター" },
        ]}
        required
      />
    );
  },
};

/**
 * フォームの例
 */
export const CompleteForm: Story = {
  args: {
    label: "フォーム",
    id: "form",
    children: <Input />,
  },
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    return (
      <div className="w-96 space-y-4">
        <InputField
          label="名前"
          id="name"
          value={name}
          onChange={setName}
          placeholder="山田太郎"
          required
        />
        <InputField
          label="メールアドレス"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="yamada@example.com"
          required
        />
        <SelectField
          label="ロール"
          id="role"
          value={role}
          onChange={setRole}
          options={[
            { value: "user", label: "ユーザー" },
            { value: "admin", label: "管理者" },
          ]}
          required
        />
      </div>
    );
  },
};

/**
 * エラー状態のフォーム
 */
export const FormWithErrors: Story = {
  args: {
    label: "フォーム",
    id: "form",
    children: <Input />,
  },
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("invalid-email");

    return (
      <div className="w-96 space-y-4">
        <InputField
          label="名前"
          id="name"
          value={name}
          onChange={setName}
          placeholder="山田太郎"
          required
          error="名前を入力してください"
        />
        <InputField
          label="メールアドレス"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="user@example.com"
          required
          error="有効なメールアドレスを入力してください"
        />
      </div>
    );
  },
};

/**
 * 様々な入力タイプ
 */
export const AllInputTypes: Story = {
  args: {
    label: "フォーム",
    id: "form",
    children: <Input />,
  },
  render: () => {
    const [text, setText] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");

    return (
      <div className="w-96 space-y-4">
        <InputField
          label="テキスト"
          id="text"
          value={text}
          onChange={setText}
          placeholder="テキスト入力"
        />
        <InputField
          label="メール"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="user@example.com"
        />
        <InputField
          label="パスワード"
          id="password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="パスワード"
        />
        <InputField
          label="数値"
          id="number"
          type="number"
          value={number}
          onChange={setNumber}
          placeholder="0"
        />
      </div>
    );
  },
};
