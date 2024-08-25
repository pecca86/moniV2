import { useQuery } from "@tanstack/react-query";
import { getAccountById } from "../../services/apiAccounts";

export function useFetchAccount(id: string) {
    const {
        isPending,
        data: account,
        error,
    } = useQuery({
        queryKey: ['account'],
        queryFn: () => getAccountById(id),
    });

    return { isPending, account, error };
}