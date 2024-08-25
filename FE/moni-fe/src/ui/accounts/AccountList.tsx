import { useQuery } from "@tanstack/react-query";
import AccountListItem from "./AccountListItem";
import { getAccounts } from "../../services/apiAccounts";

const AccountList = () => {

    const { isPending, data: accounts, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    })

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!isPending && error) {
        return <div>Error: {error.message}</div>
    }

    const totalBalance = accounts?.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div className="my-2">
            {accounts?.length === 0 && <div><p>Click the 'add account' button on top, to create a new account!</p></div>}

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
