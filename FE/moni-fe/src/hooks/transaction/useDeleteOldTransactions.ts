import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteAllOldTransactions } from "../../services/apiTransactions";

export function useDeleteOldTransactions(accountId: string | undefined, token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteOldTransactionsMutation } = useMutation({
        mutationFn: () => deleteAllOldTransactions(accountId, token),
        onSuccess: () => {
            toast.success('Old Transactions deleted successfully');
            queryClient.refetchQueries({ queryKey: ['transactions'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['account-category-statistics'] });
        },
        onError: () => {
            toast.error('Error deleting transactions');
        }
    });

    return { isDeleting, deleteOldTransactionsMutation };
}