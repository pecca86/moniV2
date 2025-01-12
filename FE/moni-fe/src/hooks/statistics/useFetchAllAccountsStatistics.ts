import { useQuery } from "@tanstack/react-query";
import { getAllAccountsAndTransactionsStatistics } from "../../services/apiStatistics";

export function useFetchAllAccountsStatistics(token: string | null) {
    const {
        isPending,
        data,
        error,
    } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => getAllAccountsAndTransactionsStatistics(token),
    });

    return { isPending, data, error };
}