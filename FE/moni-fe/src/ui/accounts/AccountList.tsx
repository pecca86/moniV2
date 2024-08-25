import AccountListItem from "./AccountListItem";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import MoniBanner from "../banners/MoniBanner";
import { useFetchAccounts } from "../../hooks/account/useFetchAccounts";

const AccountList = () => {

    const { isPending, accountsData, error } = useFetchAccounts();

    if (isPending) {
        return (
            <Stack spacing={1}>
                <Skeleton variant="rectangular" width={350} height={137} />
            </Stack>
        )
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the account data, please try again later!</MoniBanner>
    }

    // accountsData?.accounts?.sort((a, b) => a.name.localeCompare(b.name));
    // console.log("sort ", accountsData?.accounts.sort());

    return (
        <div className="my-2">
            {accountsData?.accounts?.length === 0 && <MoniBanner style="info">Click the 'add account' button on top, to create a new account!</MoniBanner>}

            <div className="relative overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                    <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Account name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Balance
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountsData?.accounts?.map((acc) => (
                            <AccountListItem key={acc.id} acc={acc} />
                        ))}
                        <tr className="bg-purple-400 text-white">
                            <th scope="col" className="px-6 py-3">Total:</th>
                            <th scope="col" className="px-6 py-3">{accountsData?.totalBalance}</th>
                            <th scope="col" className="px-6 py-3">€</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AccountList;
