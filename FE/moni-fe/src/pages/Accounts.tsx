import AccountList from '../ui/accounts/AccountList';
import MoniLineChart from '../ui/charts/MoniLineChart';
import AddModal from '../ui/cta/AddModal';
import AccountForm from '../ui/accounts/AccountForm';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import { useFetchAllAccountsStatistics } from '../hooks/statistics/useFetchAllAccountsStatistics';
import { CircularProgress } from '@mui/material';
import MoniBanner from '../ui/banners/MoniBanner';


const Accounts = () => {
    const { isPending, data, error } = useFetchAllAccountsStatistics();

    return (
        <section className='px-8 flex flex-col gap-10 lg:mx-10'>
            <div className='mt-2'>
                <section className='lg:w-[80rem] lg:m-auto'>
                    <AddModal
                        ctaText='Add Account'
                        heading='Add a new account'
                        paragraph='Fill in the form below to add a new account'
                        form={<AccountForm handleClose={undefined} update={false} accountData={undefined} />}
                        buttonIcon={<AddIcon />}
                    />
                    <AccountList />
                </section>
            </div>
            <Divider />
            {isPending ? <CircularProgress /> :
                <section className='lg:w-[80rem] lg:m-auto'>
                    <MoniLineChart accountStatisticsData={data} />
                </section>
            }
            {error && <MoniBanner style='warning'>Some went wrong while fetching the statistics data!</MoniBanner>}
        </section>
    );
}

export default Accounts;
