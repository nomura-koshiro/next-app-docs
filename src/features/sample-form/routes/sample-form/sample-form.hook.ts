"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sampleFormSchema,
  type SampleFormValues,
} from "../../schemas/sample-form.schema";

/**
 * サンプルフォームページのカスタムフック
 *
 * フォームの状態管理とロジックを担当します。
 */
export const useSampleForm = () => {
  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
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

  const onSubmit = async (data: SampleFormValues) => {
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
