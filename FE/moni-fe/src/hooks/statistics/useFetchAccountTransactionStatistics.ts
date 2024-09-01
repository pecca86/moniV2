import { useQuery } from "@tanstack/react-query";
import { getAccountTransactionStatistics } from "../../services/apiStatistics";

export function useFetchAccountsTransactionStatistics(accountId: string) {
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => getAccountTransactionStatistics(accountId),
    });

    return { isPending, data, error };
}