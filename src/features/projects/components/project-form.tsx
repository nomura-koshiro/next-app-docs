import { Control, FieldErrors, FieldPath } from "react-hook-form";

import { Button } from "@/components/sample-ui/button";
import { Card, CardContent } from "@/components/sample-ui/card";
import { ErrorMessage } from "@/components/sample-ui/error-message";
import {
  ControlledCheckboxField,
  ControlledInputField,
  ControlledTextareaField,
} from "@/components/sample-ui/form-field/controlled-form-field";

import type { CreateProjectInput, UpdateProjectInput } from "../types/forms";

type ProjectFormData = CreateProjectInput | UpdateProjectInput;

type ProjectFormProps<T extends ProjectFormData = CreateProjectInput> = {
  /** React Hook Formのcontrolオブジェクト */
  control: Control<T>;
  /** フォーム送信ハンドラー */
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  /** キャンセルボタンのクリックハンドラー */
  onCancel: () => void;
  /** フォームエラー */
  errors: FieldErrors<T>;
  /** 送信中かどうか */
  isSubmitting: boolean;
  /** 編集モードかどうか（デフォルト: false） */
  isEditMode?: boolean;
};

/**
 * プロジェクトフォームコンポーネント（プレゼンテーション）
 *
 * プロジェクトの作成・編集に使用するフォームの表示を担当します。
 * ロジックは含まず、純粋な表示とイベント通知のみを行います。
 *
 * 機能:
 * - プロジェクト名入力フィールド
 * - 説明入力フィールド（任意）
 * - ステータス選択フィールド（アクティブ/非アクティブ）
 * - エラーメッセージ表示
 * - 送信・キャンセルボタン
 * - 作成/編集モードの切り替え（ボタンテキストの変更）
 *
 * @param props - ProjectFormコンポーネントのプロパティ
 * @returns プロジェクトフォーム要素
 */
export const ProjectForm = <T extends ProjectFormData = CreateProjectInput>({
  control,
  onSubmit,
  onCancel,
  errors,
  isSubmitting,
  isEditMode = false,
}: ProjectFormProps<T>) => {
  // ================================================================================
  // 変数
  // ================================================================================
  const submitButtonText = isEditMode ? (isSubmitting ? "更新中..." : "更新") : isSubmitting ? "作成中..." : "作成";

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <ControlledInputField
            control={control}
            name={"name" as FieldPath<T>}
            label="プロジェクト名"
            placeholder="プロジェクト名を入力"
            required
          />

          <ControlledTextareaField
            control={control}
            name={"description" as FieldPath<T>}
            label="説明"
            placeholder="プロジェクトの説明を入力（任意）"
            rows={4}
          />

          <ControlledCheckboxField control={control} name={"is_active" as FieldPath<T>} label="アクティブ" />

          {errors.root && <ErrorMessage message={errors.root.message ?? ""} />}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {submitButtonText}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
