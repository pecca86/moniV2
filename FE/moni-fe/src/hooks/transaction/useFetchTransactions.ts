import { useQuery } from "@tanstack/react-query";
import { getAccountTransactions } from "../../services/apiTransactions";

export function useFetchTransactions(accountId: string) {
    const {
        isPending,
        data: transactions,
        error,
    } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => getAccountTransactions(accountId),
    });

    return { isPending, transactions, error };
}