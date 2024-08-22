import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TopNav = () => {

    const navigate = useNavigate();
    
    return (
        <nav className='bg-gray-600 md:mb-7 mb-2 text-white flex items-center justify-between md:justify-start md:space-x-20 px-4 md:px-10 py-5'>
            <span className='hover:bg-violet-600 hover:cursor-pointer active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300' onClick={() => navigate('/accounts')}>Accounts 🏦</span>
            <div className="space-x-2">
                <span onClick={() => toast.success("Successfully logged out!")}>Logout 🚪</span>
                <span className='hover:bg-violet-600 hover:cursor-pointer active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300' onClick={() => navigate('/profile')}>Profile 👤</span>
            </div>

        </nav>
    );
}

export default TopNav;
