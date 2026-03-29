import AccountListItem from "./AccountListItem";
import Skeleton from '@mui/material/Skeleton';
import MoniBanner from "../banners/MoniBanner";
import { useFetchAccounts } from "../../hooks/account/useFetchAccounts";
import { useUser } from "../../hooks/auth/useUser";

const AccountList = () => {
    const { token } = useUser();
    const { isPending, accountsData, error } = useFetchAccounts(token);

    if (isPending) {
        return <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '12px' }} />;
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the account data, please try again later!</MoniBanner>;
    }

    return (
        <div>
            {accountsData?.accounts?.length === 0 && (
                <MoniBanner style="info">Click 'Add account' to create your first account!</MoniBanner>
            )}
            <div className="bg-white rounded-xl border border-[#E3E8EF] overflow-hidden shadow-stripe-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#E3E8EF] bg-[#F6F9FC]">
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#697386] uppercase tracking-wide">
                                Account name
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#697386] uppercase tracking-wide">
                                Balance
                            </th>
                            <th className="w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountsData?.accounts?.map((acc) => (
                            <AccountListItem key={acc.id} acc={acc} />
                        ))}
                        <tr className="border-t border-[#E3E8EF] bg-[#F6F9FC]">
                            <td className="px-6 py-3 text-sm font-semibold text-[#1A1F36]">Total</td>
                            <td className="px-6 py-3 text-sm font-semibold text-[#1A1F36] text-right">
                                {accountsData?.totalBalance} €
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AccountList;
