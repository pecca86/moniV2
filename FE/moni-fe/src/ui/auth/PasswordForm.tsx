import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUser } from "../../hooks/auth/useUser";
import { changePassword } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

const PasswordForm = () => {
    const { token } = useUser();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data: any) => {
        if (data.password !== data.password2) {
            toast.error('Passwords do not match');
            return;
        }
        if (token) {
            changePassword(data.password, token);
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            toast.error('Token is missing');
        }
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="stripe-label" htmlFor="password">New password</label>
                <input className="stripe-input" type="password" id="password" placeholder="••••••••" {...register('password')} />
            </div>
            <div>
                <label className="stripe-label" htmlFor="password2">Repeat new password</label>
                <input className="stripe-input" type="password" id="password2" placeholder="••••••••" {...register('password2')} />
            </div>
            <input className="stripe-btn-primary w-full justify-center mt-2 cursor-pointer" type="submit" value="Update password" />
        </form>
    );
}

export default PasswordForm;
