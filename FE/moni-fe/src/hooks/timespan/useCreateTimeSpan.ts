import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTimeSpan } from "../../services/apiTimeSpans";

export function useCreateTimeSpan() {
    const queryClient = useQueryClient();

    const { isPending: isAdding, mutate: createTimeSpanMutation } = useMutation({
        mutationFn: createTimeSpan,
        onSuccess: () => {
            toast.success('Time span added successfully');
            queryClient.invalidateQueries({ queryKey: ['timespans'] });
        },
        onError: () => {
            toast.error('Error adding time span');
        }
    });

    return { isAdding, createTimeSpanMutation };

}