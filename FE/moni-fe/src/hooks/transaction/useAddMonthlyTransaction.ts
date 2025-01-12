import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addMonthlyTransaction } from "../../services/apiTransactions";
import { MonthlyTransactionFormData } from "../../types/global";

export function useAddMonthlyTransaction(token: string | null) {
    const queryClient = useQueryClient();

    const { isPending: isAddingMonthly, mutate: addMonthlyTransactionMutation } = useMutation({
      mutationFn: (data: MonthlyTransactionFormData) => addMonthlyTransaction(data, token),
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["transactions"] });
        queryClient.refetchQueries({ queryKey: ["account"] });
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
        queryClient.invalidateQueries({ queryKey: ['account-statistics'] });
        queryClient.invalidateQueries({ queryKey: ['account-category-statistics'] });
      },
      onError: (err) => toast.error(err.message),
    });
  
    return { isAddingMonthly, addMonthlyTransactionMutation };

}