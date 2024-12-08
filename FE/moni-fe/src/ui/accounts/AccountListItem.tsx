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
        <tr className="bg-white border-b text-sm font-light sm:hover:cursor-pointer sm:hover:bg-purple-300 sm:hover:text-white" onClick={handleNavigateClick}>
            <th scope="col" className="px-6 py-3">{acc.name}</th>
            <th scope="col" className="px-6 py-3">{acc.balance}</th>
            <th scope="col" className="px-6 py-3">€</th>
        </tr>

    );
}

export default AccountListItem;
