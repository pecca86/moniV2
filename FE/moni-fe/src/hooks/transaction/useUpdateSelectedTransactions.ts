import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSelectedTransactions } from "../../services/apiTransactions";

export function useUpdateSelectedTransactions() {
    const queryClient = useQueryClient();

    const { isPending: isUpdatingTransactions, mutate: updateSelectedTransactionMutation} = useMutation({
        mutationFn: updateSelectedTransactions,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-category-statistics'] });
        },
        onError: (e) => {
            console.log("HOOK ERROR", e);
            toast.error('Error updating transaction');
        }
    })

    return { isUpdatingTransactions, updateSelectedTransactionMutation };
}