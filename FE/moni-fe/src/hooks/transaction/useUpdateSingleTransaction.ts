import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTransaction } from "../../services/apiTransactions";

export function useUpdateSingleTransaction() {
    const queryClient = useQueryClient();

    const { isPending: isUpdating, mutate: updateTransactionMutation} = useMutation({
        mutationFn: updateTransaction,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            toast.error('Error updating transaction');
        }
    })

    return { isUpdating, updateTransactionMutation };
}