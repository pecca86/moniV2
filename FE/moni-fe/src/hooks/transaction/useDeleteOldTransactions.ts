import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteAllOldTransactions } from "../../services/apiTransactions";

export function useDeleteOldTransactions(accountId: string | undefined) {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteOldTransactionsMutation } = useMutation({
        mutationFn: () => deleteAllOldTransactions(accountId),
        onSuccess: () => {
            toast.success('Old Transactions deleted successfully');
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
        },
        onError: () => {
            toast.error('Error deleting transactions');
        }
    });

    return { isDeleting, deleteOldTransactionsMutation };
}