import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../services/apiAuth";

export function useUserDetails(token: string) {

    const {
        isPending,
        data: userDetails,
        error
    } = useQuery({
        queryKey: ['userDetails'],
        queryFn: () => getUserDetails(token),
    });

    return { isPending, userDetails, error };
}