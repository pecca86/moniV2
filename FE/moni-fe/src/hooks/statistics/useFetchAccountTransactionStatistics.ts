import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountTransactionStatistics } from "../../services/apiStatistics";

export function useFetchAccountsTransactionStatistics(accountId: string, token: string | null) {
    const queryClient = useQueryClient();
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['account-statistics'],
        queryFn: () => getAccountTransactionStatistics(accountId, token),
    });

    queryClient.invalidateQueries({ queryKey: ['statistics'] });

    return { isPending, data, error };
}