import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSelectedTransactions } from "../../services/apiTransactions";
import { UpdateSelectedTransactionFormData } from "../../types/global";

export function useUpdateSelectedTransactions(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isUpdatingTransactions, mutate: updateSelectedTransactionMutation} = useMutation({
        mutationFn:(data: UpdateSelectedTransactionFormData) => updateSelectedTransactions(data, token),
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