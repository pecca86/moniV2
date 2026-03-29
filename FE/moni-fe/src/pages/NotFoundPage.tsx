import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <p className="text-7xl font-bold text-[#635BFF]">404</p>
            <h1 className="mt-4 text-2xl font-semibold text-[#1A1F36]">Page not found</h1>
            <p className="mt-2 text-sm text-[#697386]">The page you're looking for doesn't exist.</p>
            <button
                onClick={() => navigate('/accounts')}
                className="stripe-btn-primary mt-8"
            >
                Back to accounts
            </button>
        </div>
    );
}

export default NotFoundPage;
