import { useQuery } from "@tanstack/react-query";
import { getDateSpansForAccount } from "../../services/apiTimeSpans";

export function useFetchTimeSpansForAccount(accountId: string | undefined, token: string | null) {
    const {
        isPending,
        data: timeSpans,
        error
    } = useQuery({
        queryKey: ["timespans"],
        queryFn: () => getDateSpansForAccount(accountId, token),
    });

    return { isPending, timeSpans, error}
}