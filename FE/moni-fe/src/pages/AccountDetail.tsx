import SideNav from "../ui/account-detail/SideNav";
import { Outlet } from "react-router-dom";

const AccountDetail = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
            <SideNav />
            <Outlet />
        </div>
    );
}

export default AccountDetail;
