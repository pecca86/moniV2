import { useNavigate } from "react-router-dom";
import MoniForm from "../ui/forms/FormContext";
import { useRegister } from "../hooks/auth/useRegister";

const Register = () => {
    const navigate = useNavigate();
    const { registerMutation } = useRegister();

    return (
        <div className="min-h-screen bg-[#F6F9FC] flex flex-col justify-center items-center px-4 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-[#0A2540] tracking-widest">MONI</h1>
                <p className="mt-2 text-sm text-[#697386]">Create your account</p>
            </div>
            <div className="w-full max-w-sm bg-white rounded-xl border border-[#E3E8EF] shadow-stripe p-8">
                <MoniForm formHook={registerMutation}>
                    <MoniForm.MoniLabel htmlFor="email" label="Email" />
                    <MoniForm.MoniInput type="text" validation={{ required: 'Email is required' }} id="email" name="email" placeholder="you@example.com" />
                    <MoniForm.MoniLabel htmlFor="firstname" label="First name" />
                    <MoniForm.MoniInput type="text" validation={{ required: 'First name is required' }} id="firstname" name="firstname" placeholder="First name" />
                    <MoniForm.MoniLabel htmlFor="lastname" label="Last name" />
                    <MoniForm.MoniInput type="text" validation={{ required: 'Last name is required' }} id="lastname" name="lastname" placeholder="Last name" />
                    <MoniForm.MoniLabel htmlFor="password" label="Password" />
                    <MoniForm.MoniInput type="password" validation={{ required: 'Password is required' }} id="password" name="password" />
                    <MoniForm.MoniLabel htmlFor="password2" label="Confirm password" />
                    <MoniForm.MoniInput type="password" validation={{ required: 'Password confirmation is required' }} id="password2" name="password2" />
                    <MoniForm.MoniSubmit ctaText="Create account" />
                </MoniForm>
                <div className="mt-6 text-center text-sm text-[#697386]">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#635BFF] hover:text-[#7A73FF] font-medium transition-colors"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
