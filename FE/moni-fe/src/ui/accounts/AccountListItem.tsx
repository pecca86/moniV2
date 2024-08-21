import { useNavigate } from "react-router-dom";


const AccountListItem = () => {

    const navigate = useNavigate();

    return (
        <div>
            AccountListItem
            <button className="m-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/account-details/1')}>Account details</button>
        </div>
    );
}

export default AccountListItem;
