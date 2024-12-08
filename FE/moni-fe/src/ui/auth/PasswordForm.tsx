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
        localStorage.removeItem('token')
        navigate('/login');
    }

    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="password">New password</label>
            <input className={inputStyle} type="password" id="password" {...register('password')} />

            <label htmlFor="password">Repeat new password</label>
            <input className={inputStyle} type="password" id="password2" {...register('password2')} />

            <input className={submitBtnStyle} type="submit" value="submit" />
        </form>
    );
}

export default PasswordForm;