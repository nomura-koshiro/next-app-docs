import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/tanstack-query";
import type { User, CreateUserInput } from "../types";

export const createUserInputSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("正しいメールアドレスを入力してください"),
  role: z.string().min(1, "ロールは必須です"),
});

export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post("/users", data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
