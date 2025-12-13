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
        <span onClick={onLogout}>
            <a href="#" className="inline-flex items-center font-medium text-fg-brand hover:underline">
                Logout <LogoutIcon />
            </a>
        </span>
    )
}

export default LogOut;