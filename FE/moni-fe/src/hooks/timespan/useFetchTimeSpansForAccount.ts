import { useQuery } from "@tanstack/react-query";
import { getDateSpansForAccount } from "../../services/apiTimeSpans";

export function useFetchTimeSpansForAccount() {
    const {
        isPending,
        data: timeSpans,
        error
    } = useQuery({
        queryKey: ["timespans"],
        queryFn: getDateSpansForAccount,
    });

    return { isPending, timeSpans, error}
}