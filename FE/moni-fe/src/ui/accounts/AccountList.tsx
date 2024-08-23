import { useQuery } from "@tanstack/react-query";
import AccountListItem from "./AccountListItem";
import { getAccounts } from "../../services/apiAccounts";

const AccountList = () => {

    const {isPending, data: accounts, error} = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    })

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!isPending && error) {
        return <div>Error: {error.message}</div>
    }


    return (
        <div className="bg-blue-300">
            AccountList:
            {accounts?.map((a) => (
                <AccountListItem key={a.id} acc={a}/>
            ))}
            Total: 1000€
        </div>
    );
}

export default AccountList;
