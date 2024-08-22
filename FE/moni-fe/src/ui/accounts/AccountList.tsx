import { useQuery } from "@tanstack/react-query";
import AccountListItem from "./AccountListItem";
import { getAccounts } from "../../services/apiAccounts";

const AccountList = () => {

    useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    })

    return (
        <div className="bg-blue-300">
            AccountList:
            <AccountListItem />
            <AccountListItem />
            <AccountListItem />
            Total: 1000€
        </div>
    );
}

export default AccountList;
