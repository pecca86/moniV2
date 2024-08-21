import AccountList from '../ui/accounts/AccountList';
import LineChart from '../ui/charts/LineChart';
import AddCta from '../ui/cta/AddCta';

const Accounts = () => {
    return (
        <section className='px-8'>
            ACCOUNTS
            <AddCta />
            <AccountList />
            <LineChart />
        </section>
    );
}

export default Accounts;
