import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TopNav = () => {

    const navigate = useNavigate();

    return (
        <nav className='bg-indigo-700 md:mb-7 mb-2 text-white flex items-center justify-between md:justify-start md:space-x-20 px-4 md:px-10 py-5 shadow-md'>
            <span className='hover:cursor-pointer focus:outline-none focus:ring' onClick={() => navigate('/accounts')}><AccountBalanceIcon>Accounts</AccountBalanceIcon></span>
            <div className="space-x-2">
                <span className="text-sm" onClick={() => toast.success("Successfully logged out!")}>Logout <LogoutIcon /></span>
                <span className='text-sm hover:bg-violet-600 hover:cursor-pointer active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300' onClick={() => navigate('/profile')}>Profile <AccountCircleIcon /></span>
            </div>

        </nav>
    );
}

export default TopNav;
