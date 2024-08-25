import AccountList from '../ui/accounts/AccountList';
import MoniLineChart from '../ui/charts/MoniLineChart';
import AddModal from '../ui/cta/AddModal';
import AccountForm from '../ui/accounts/AccountForm';
import Divider from '@mui/material/Divider';

const Accounts = () => {

    return (
        <section className='px-8 flex flex-col gap-10'>
            <div className='mt-2'>
                <AddModal
                    ctaText='Add Account'
                    heading='Add a new account'
                    paragraph='Fill in the form below to add a new account'
                    form={<AccountForm />}
                />
                <AccountList />
            </div>
            <Divider />
            <MoniLineChart />
        </section>
    );
}

export default Accounts;
