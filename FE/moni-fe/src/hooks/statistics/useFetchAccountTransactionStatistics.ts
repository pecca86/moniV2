import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountTransactionStatistics } from "../../services/apiStatistics";

export function useFetchAccountsTransactionStatistics(accountId: string) {
    const queryClient = useQueryClient();
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['account-statistics'],
        queryFn: () => getAccountTransactionStatistics(accountId),
    });

    queryClient.invalidateQueries({ queryKey: ['statistics'] });

    return { isPending, data, error };
}