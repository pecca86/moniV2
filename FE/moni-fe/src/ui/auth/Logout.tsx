import LogoutIcon from '@mui/icons-material/Logout';
import { useLogout } from '../../hooks/auth/useLogout';
import toast from 'react-hot-toast';

function LogOut() {
    const { logout } = useLogout();

    const onLogout = () => {
        logout();
        toast.success('You have been logged out');
    }

    return (
        <button
            onClick={onLogout}
            className="text-sm text-[#8898A9] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1A3A5C]"
        >
            <LogoutIcon fontSize="small" />
            <span className="hidden sm:inline">Logout</span>
        </button>
    )
}

export default LogOut;
