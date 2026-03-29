import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogOut from "../auth/Logout";

const TopNav = () => {
    const navigate = useNavigate();

    return (
        <nav className='bg-[#0A2540] text-white flex items-center justify-between px-6 md:px-10 py-4 shadow-md'>
            <span
                className='font-bold text-lg tracking-widest cursor-pointer text-white hover:text-[#635BFF] transition-colors select-none'
                onClick={() => navigate('/accounts')}
            >
                MONI
            </span>
            <div className="flex items-center gap-1">
                <button
                    className='text-sm text-[#8898A9] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1A3A5C]'
                    onClick={() => navigate('/profile')}
                >
                    <AccountCircleIcon fontSize="small" />
                    <span className="hidden sm:inline">Profile</span>
                </button>
                <div className="w-px h-4 bg-[#1A3A5C] mx-1" />
                <LogOut />
            </div>
        </nav>
    );
}

export default TopNav;
