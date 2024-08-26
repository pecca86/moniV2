import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTransaction } from "../../services/apiTransactions";

export function useAddTransaction() {
    const queryClient = useQueryClient();

    const { isPending: isAdding, mutate: addTransactionMutation } = useMutation({
        mutationFn: addTransaction,
        onSuccess: () => {
            toast.success('Transaction added successfully');
            queryClient.refetchQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            toast.error('Error adding transaction');
        }
    });

    return { isAdding, addTransactionMutation };
}