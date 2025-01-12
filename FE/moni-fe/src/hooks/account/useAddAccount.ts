import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAccount } from "../../services/apiAccounts";
import { AccountFormData } from "../../types/global";

export function useAddAccount(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isAdding, mutate: addAccountMutation } = useMutation({
        mutationFn: (data: AccountFormData) => addAccount(data, token),
        onSuccess: () => {
            toast.success('Account added successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: () => {
            toast.error('Error adding account');
        }
    });
    return { isAdding, addAccountMutation };
}