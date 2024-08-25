import { useQuery } from "@tanstack/react-query";
import AccountListItem from "./AccountListItem";
import { getAccounts } from "../../services/apiAccounts";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import MoniBanner from "../banners/MoniBanner";
import { Divider } from "@mui/material";

const AccountList = () => {

    const { isPending, data: accounts, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    })

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

    const totalBalance = accounts?.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div className="my-2">
            {accounts?.length === 0 && <MoniBanner style="info">Click the 'add account' button on top, to create a new account!</MoniBanner>}

            <div className="relative overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                    <thead className="text-xs text-gray-900 uppercase bg-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Account name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Balance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts?.map((acc) => (
                            <AccountListItem key={acc.id} acc={acc} />
                        ))}
                        <tr className="bg-purple-400">
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                Total
                            </th>
                            <td className="px-6 py-4 text-white">
                                {totalBalance} €
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AccountList;
