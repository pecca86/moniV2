import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../services/apiAccounts";

export function useFetchAccounts(token: string | null) {
    const {
        isPending,
        data: accountsData,
        error,
    } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => getAccounts(token),
    });

    return { isPending, accountsData, error };
}