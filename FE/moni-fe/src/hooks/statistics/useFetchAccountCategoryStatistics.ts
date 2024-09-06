import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountCategoryStatistics } from "../../services/apiStatistics";

export function useFetchAccountCategoryStatistics(accountId: string) {
    // const queryClient = useQueryClient();
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['account-category-statistics'],
        queryFn: () => getAccountCategoryStatistics(accountId),
    });

    // queryClient.invalidateQueries({ queryKey: ['statistics'] });

    return { isPending, data, error };
}