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
        <span onClick={onLogout}>Logout <LogoutIcon /></span>
    )
}

export default LogOut;