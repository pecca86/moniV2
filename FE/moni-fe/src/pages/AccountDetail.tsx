import SideNav from "../ui/account-detail/SideNav";
import { Outlet } from "react-router-dom";

const AccountDetail = () => {
    return (
        <>
            <SideNav />
            <section className="flex mt-[55px]">
                <div className="h-svh w-full mx-2 overflow-scroll lg:w-[80rem] lg:m-auto">
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default AccountDetail;
