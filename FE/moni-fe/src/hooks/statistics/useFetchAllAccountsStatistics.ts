import { useQuery } from "@tanstack/react-query";
import { getAllAccountsAndTransactionsStatistics } from "../../services/apiStatistics";

export function useFetchAllAccountsStatistics() {
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => getAllAccountsAndTransactionsStatistics(),
    });

    return { isPending, data, error };
}