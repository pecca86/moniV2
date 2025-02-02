import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateAccount } from "../../services/apiAccounts";
import { AccountFormData } from "../../types/global";

export function useUpdateAccount(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isUpdating, mutate: updateAccountMutation } = useMutation({
        mutationFn: (data: AccountFormData) => updateAccount(data, token),
        onSuccess: () => {
            toast.success('Account updated successfully');
            // queryClient.invalidateQueries({ queryKey: ['account'] });
            queryClient.refetchQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error('Error updating account');
        }
    });

    return { isUpdating, updateAccountMutation };

}