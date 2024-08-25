import { useNavigate } from "react-router-dom";

interface AccountListItemProps {
    acc: Account;
}

const AccountListItem: React.FC<AccountListItemProps> = ({ acc }) => {

    const navigate = useNavigate();

    return (
        <tr className="bg-white border-b text-sm font-light" onClick={() => navigate(`/account-details/${acc.id}/main`)}>
            <th scope="col" className="px-6 py-3">{acc.name}</th>
            <th scope="col" className="px-6 py-3">{acc.balance}</th>
            <th scope="col" className="px-6 py-3">€</th>
        </tr>

    );
}

export default AccountListItem;
