import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountById } from "../../services/apiAccounts";

export function useFetchAccount(id: string, token: string | null) {
    const queryClient = useQueryClient();

    const {
        isPending,
        data: account,
        error,
    } = useQuery({
        queryKey: ['account'],
        queryFn: () => getAccountById(id, token),
    });

    queryClient.invalidateQueries({ queryKey: ['statistics'] });

    return { isPending, account, error };
}