import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import type { User, UpdateUserInput } from "../types";

export const updateUserInputSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレスを入力してください"),
  role: z.string().min(1, "ロールは必須です"),
});

export const updateUser = ({
  userId,
  data,
}: {
  userId: string;
  data: UpdateUserInput;
}): Promise<User> => {
  return api.put(`/users/${userId}`, data);
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
