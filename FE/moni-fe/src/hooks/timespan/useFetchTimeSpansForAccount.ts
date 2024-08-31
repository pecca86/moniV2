import { useQuery } from "@tanstack/react-query";
import { getDateSpansForAccount } from "../../services/apiTimeSpans";

export function useFetchTimeSpansForAccount(accountId: string | undefined) {
    const {
        isPending,
        data: timeSpans,
        error
    } = useQuery({
        queryKey: ["timespans"],
        queryFn: () => getDateSpansForAccount(accountId),
    });

    return { isPending, timeSpans, error}
}