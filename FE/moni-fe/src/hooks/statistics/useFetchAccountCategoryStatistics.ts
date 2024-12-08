import { useQuery } from "@tanstack/react-query";
import { getAccountCategoryStatistics } from "../../services/apiStatistics";

export function useFetchAccountCategoryStatistics(accountId: string) {
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['account-category-statistics'],
        queryFn: () => getAccountCategoryStatistics(accountId),
    });

    return { isPending, data, error };
}