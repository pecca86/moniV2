import { useNavigate } from "react-router-dom";
import LoginForm from "../ui/auth/LoginForm";

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F6F9FC] flex flex-col justify-center items-center px-4">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-[#0A2540] tracking-widest">MONI</h1>
                <p className="mt-2 text-sm text-[#697386]">Sign in to your account</p>
            </div>
            <div className="w-full max-w-sm bg-white rounded-xl border border-[#E3E8EF] shadow-stripe p-8">
                <LoginForm />
                <div className="mt-6 text-center text-sm text-[#697386]">
                    Not yet a member?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-[#635BFF] hover:text-[#7A73FF] font-medium transition-colors"
                    >
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
