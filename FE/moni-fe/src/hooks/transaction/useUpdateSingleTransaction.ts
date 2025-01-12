import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTransaction } from "../../services/apiTransactions";
import { Transaction } from "../../types/global";

export function useUpdateSingleTransaction(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isUpdating, mutate: updateTransactionMutation} = useMutation({
        mutationFn: (data: Transaction) => updateTransaction(data, token),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-category-statistics'] });
        },
        onError: () => {
            toast.error('Error updating transaction');
        }
    })

    return { isUpdating, updateTransactionMutation };
}