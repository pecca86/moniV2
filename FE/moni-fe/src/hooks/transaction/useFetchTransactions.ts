import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../services/apiTransactions";

export function useFetchTransactions() {
    const {
        isPending,
        data: transactions,
        error,
    } = useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });

    return { isPending, transactions, error };
}