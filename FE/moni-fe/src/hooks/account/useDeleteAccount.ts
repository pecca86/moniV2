import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../services/apiAccounts";
import toast from "react-hot-toast";

export function useDeleteAccount(id: string | undefined) {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteAccountMutation } = useMutation({
        mutationFn: () => deleteAccount(id),
        onSuccess: () => {
            toast.success('Account deleted successfully');
            queryClient.refetchQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account'] });
        },
        onError: () => {
            toast.error('Error deleting account');
        }
    });

    return { isDeleting, deleteAccountMutation };
}