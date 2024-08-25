import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAccount, updateAccount } from "../../services/apiAccounts";

export function useAddAccount() {
    const queryClient = useQueryClient();

    // const { isPending: isAdding, mutate: addAccountMutation } = useMutation({
    //     mutationFn: addAccount,
    //     onSuccess: () => {
    //         toast.success('Account added successfully');
    //         queryClient.invalidateQueries({ queryKey: ['accounts'] });
    //         reset(); // reset the form using react-hook-form
    //         handleClose();
    //     },
    //     onError: () => {
    //         toast.error('Error adding account');
    //     }
        
}