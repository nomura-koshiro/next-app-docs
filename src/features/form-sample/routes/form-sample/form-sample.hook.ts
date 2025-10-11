import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSampleSchema,
  type FormSampleValues,
} from "../../schemas/form-sample.schema";

/**
 * フォームサンプルページのカスタムフック
 *
 * フォームの状態管理とロジックを担当します。
 */
export const useFormSample = () => {
  const form = useForm<FormSampleValues>({
    resolver: zodResolver(formSampleSchema),
    defaultValues: {
      username: "",
      email: "",
      age: "",
      country: "",
      bio: "",
      terms: false,
      newsletter: false,
      gender: "male",
      notifications: true,
      darkMode: false,
      birthdate: "",
    },
  });

  const onSubmit = async (data: FormSampleValues) => {
    // フォームデータを表示
    console.log("Form Data:", data);
    alert(`フォームが送信されました！\n\n${JSON.stringify(data, null, 2)}`);

    // フォームをリセット
    form.reset();
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    handleSubmit,
  };
};
