import SideNav from "../ui/account-detail/SideNav";
import Panel from "../ui/account-detail/Panel";
import TransactionList from "../ui/account-detail/TransactionList";


const AccountDetail = () => {
    return (
        <>
            <section className="grid grid-rows-2 grid-flow-col gap-4 h-screen">
                <SideNav />
                <Panel />
                <TransactionList />

            </section>
        </>
    );
}

export default AccountDetail;
