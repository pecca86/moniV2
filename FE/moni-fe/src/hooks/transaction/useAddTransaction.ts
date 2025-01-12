import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTransaction } from "../../services/apiTransactions";
import { TransactionFormData } from "../../types/global";

export function useAddTransaction(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isAdding, mutate: addTransactionMutation } = useMutation({
        mutationFn: (data: TransactionFormData) => addTransaction(data, token),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-category-statistics'] });
        },
        onError: () => {
            toast.error('Error adding transaction');
        }
    });

    return { isAdding, addTransactionMutation };
}