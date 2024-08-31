import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTimeSpan } from "../../services/apiTimeSpans";

export function useDeleteTimeSpan(accountId: string | undefined, timeSpanId: number | undefined) {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteTimeSpanMutation } = useMutation({
        mutationFn: () => deleteTimeSpan(accountId, timeSpanId),
        onSuccess: () => {
            toast.success('Time span deleted successfully');
            queryClient.refetchQueries({ queryKey: ['timespans'] });
        },
        onError: () => {
            toast.error('Error deleting Time Span');
        }
    });

    return { isDeleting, deleteTimeSpanMutation };
}