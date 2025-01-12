import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../services/apiAccounts";
import toast from "react-hot-toast";

export function useDeleteAccount(id: string | undefined, token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteAccountMutation } = useMutation({
        mutationFn: () => deleteAccount(id, token),
        onSuccess: () => {
            toast.success('Account deleted successfully');
            queryClient.refetchQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account'] });
            queryClient.refetchQueries({ queryKey: ['statistics'] });
        },
        onError: () => {
            toast.error('Error deleting account');
        }
    });


    return { isDeleting, deleteAccountMutation };
}