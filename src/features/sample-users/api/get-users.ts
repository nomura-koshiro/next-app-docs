import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/tanstack-query";
import type { User } from "../types";

export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get("/sample/users");
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
