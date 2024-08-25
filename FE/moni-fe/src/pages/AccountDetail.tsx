import SideNav from "../ui/account-detail/SideNav";
import { Outlet } from "react-router-dom";

const AccountDetail = () => {
    return (
        <>
            {/* <section className="grid grid-rows-3 grid-flow-col gap-0 h-screen"> */}
            <section className="flex h-screen">
                <SideNav />
                <div className="w-full mr-2">
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default AccountDetail;
