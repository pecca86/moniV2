import AccountList from '../ui/accounts/AccountList';
import AddCta from '../ui/cta/AddCta';
import MoniLineChart from '../ui/charts/MoniLineChart';

const Accounts = () => {
    return (
        <section className='px-8 flex flex-col gap-2'>
            <AddCta />
            <AccountList />
            <MoniLineChart />
        </section>
    );
}

export default Accounts;
