import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSelectedTransactions } from "../../services/apiTransactions";

export function useDeleteSelectedTransactions() {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteSelectedTransactionsMutation } = useMutation({
        mutationFn: deleteSelectedTransactions,
        onSuccess: () => {
            toast.success('Transactions deleted successfully');
            queryClient.refetchQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            toast.error('Error deleting transactions');
        }
    });

    return { isDeleting, deleteSelectedTransactionsMutation };
}