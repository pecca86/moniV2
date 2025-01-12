import { useQuery } from "@tanstack/react-query";
import { getAccountTransactions } from "../../services/apiTransactions";

export function useFetchTransactions(accountId: string | undefined, token: string | null) {
    const {
        isPending,
        data: transactions,
        error,
    } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => getAccountTransactions(accountId, token),
    });

    return { isPending, transactions, error };
}