import { useNavigate, useParams } from "react-router-dom";


const DesktopMenu = () => {
    const navigate = useNavigate();
    const { accountId } = useParams<{ accountId: string }>();

    const navigationBtnStyle = 'shadow-purple-700 shadow-lg block px-4 py-2 text-gray-700 hover:bg-purple-400 hover:text-white hover:font-medium backdrop-blur-lg rounded-lg transition-colors duration-15000 ease-in-out';

    return (
        <>
            <aside className="invisible md:visible">
                <div className="flex justify-center m-auto gap-10">
                    <span className={navigationBtnStyle} onClick={() => navigate(`${accountId}/main`)}>Transactions</span>
                    <span className={navigationBtnStyle} onClick={() => navigate(`${accountId}/timespans`)}>Timespans</span>
                    <span className={navigationBtnStyle} onClick={() => navigate(`${accountId}/charts`)}>Charts</span>
                </div>
            </aside>
        </>
    )
}

export default DesktopMenu;