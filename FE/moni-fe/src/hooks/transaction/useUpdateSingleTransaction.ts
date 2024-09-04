import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTransaction } from "../../services/apiTransactions";

export function useUpdateSingleTransaction() {
    const queryClient = useQueryClient();

    const { isPending: isUpdating, mutate: updateTransactionMutation} = useMutation({
        mutationFn: updateTransaction,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
        },
        onError: () => {
            toast.error('Error updating transaction');
        }
    })

    return { isUpdating, updateTransactionMutation };
}