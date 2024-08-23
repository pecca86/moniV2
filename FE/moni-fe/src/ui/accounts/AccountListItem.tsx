import { useNavigate } from "react-router-dom";

interface AccountListItemProps {
    acc: Account;
}

const AccountListItem: React.FC<AccountListItemProps> = ({acc}) => {

    const navigate = useNavigate();

    return (
        <div>
            AccountListItem

            <div>{acc.iban}</div>
            <div>{acc.name}</div>
            <div>{acc.balance}</div>
      
            <button className="m-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/account-details/1/main')}>Account details</button>
        </div>
    );
}

export default AccountListItem;
