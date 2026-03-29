import { useNavigate, useParams, useLocation } from "react-router-dom";

const SideNav = () => {
    const navigate = useNavigate();
    const { accountId } = useParams<{ accountId: string }>();
    const location = useLocation();

    const tabs = [
        { label: 'Transactions', segment: 'main' },
        { label: 'Timespans', segment: 'timespans' },
        { label: 'Charts', segment: 'charts' },
    ];

    return (
        <div className="border-b border-[#E3E8EF]">
            <nav className="flex gap-1 -mb-px">
                {tabs.map(tab => {
                    const active = location.pathname.includes(`/${tab.segment}`);
                    return (
                        <button
                            key={tab.segment}
                            onClick={() => navigate(`${accountId}/${tab.segment}`)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                                active
                                    ? 'border-[#635BFF] text-[#635BFF]'
                                    : 'border-transparent text-[#697386] hover:text-[#1A1F36] hover:border-[#E3E8EF]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default SideNav;
