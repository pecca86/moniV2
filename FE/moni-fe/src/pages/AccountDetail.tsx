import SideNav from "../ui/account-detail/SideNav";
import { Outlet } from "react-router-dom";

const AccountDetail = () => {
    return (
        <>
            {/* <section className="grid grid-rows-3 grid-flow-col gap-0 h-screen"> */}
            <SideNav />
            <section className="flex mt-10">
                <div className="h-svh w-full mx-2 overflow-scroll">
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default AccountDetail;
