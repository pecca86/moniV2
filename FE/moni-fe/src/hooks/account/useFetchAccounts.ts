import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../services/apiAccounts";

export function useFetchAccounts() {
    const {
        isPending,
        data: accounts,
        error,
    } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    });

    return { isPending, accounts, error };
}