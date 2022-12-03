import { useApi } from "../utils/api";
import useDebounce from "./useDebounce";

export const useSearchUsers = (search: string) => {
  const debounceSearch = useDebounce(search, 500);
  const {
    data: users,
    error,
    mutate,
  } = useApi("/api/users", { params: { take: 10, search: debounceSearch } });
  return { users, error };
};
