import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addMonthlyTransaction } from "../../services/apiTransactions";

export function useAddMonthlyTransaction() {
    const queryClient = useQueryClient();

    const { isPending: isAddingMonthly, mutate: addMonthlyTransactionMutation } = useMutation({
      mutationFn: addMonthlyTransaction,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["transactions"] });
        queryClient.refetchQueries({ queryKey: ["account"] });
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
      },
      onError: (err) => toast.error(err.message),
    });
  
    return { isAddingMonthly, addMonthlyTransactionMutation };

}