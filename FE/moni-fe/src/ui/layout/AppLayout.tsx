import Footer from "./Footer";
import TopNav from "./TopNav";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="grid h-screen bg-red-700 grid-rows-[auto_1fr_auto]">
            <TopNav />
            <main className="bg-green-200 overflow-scroll">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default AppLayout;
