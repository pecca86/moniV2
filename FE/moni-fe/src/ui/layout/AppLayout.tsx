import Footer from "./Footer";
import TopNav from "./TopNav";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto]">
            <TopNav />
            <main className="bg-gray-50 overflow-scroll">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default AppLayout;
