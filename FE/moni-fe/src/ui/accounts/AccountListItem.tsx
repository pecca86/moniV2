import { useNavigate } from "react-router-dom";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { Account } from "../../types/global";

interface AccountListItemProps {
    acc: Account;
}

const AccountListItem: React.FC<AccountListItemProps> = ({ acc }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleNavigateClick: any = () => {
        queryClient.invalidateQueries(['account'] as InvalidateQueryFilters);
        navigate(`/account-details/${acc.id}/main`);
    }

    return (
        <tr
            className="border-b border-[#E3E8EF] last:border-b-0 hover:bg-[#F6F9FC] transition-colors cursor-pointer group"
            onClick={handleNavigateClick}
        >
            <td className="px-6 py-3.5 text-sm font-medium text-[#1A1F36]">{acc.name}</td>
            <td className="px-6 py-3.5 text-sm text-[#3C4257] text-right">{acc.balance} €</td>
            <td className="px-4 py-3.5 text-right">
                <span className="text-[#697386] group-hover:text-[#635BFF] transition-colors text-xs">›</span>
            </td>
        </tr>
    );
}

export default AccountListItem;
