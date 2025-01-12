import { useQuery } from "@tanstack/react-query";
import { getAccountCategoryStatistics } from "../../services/apiStatistics";

export function useFetchAccountCategoryStatistics(accountId: string, token: string | null) {
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['account-category-statistics'],
        queryFn: () => getAccountCategoryStatistics(accountId, token),
    });

    return { isPending, data, error };
}