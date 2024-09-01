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
        <section className='px-8 flex flex-col gap-10'>
            <div className='mt-2'>
                <AddModal
                    ctaText='Add Account'
                    heading='Add a new account'
                    paragraph='Fill in the form below to add a new account'
                    form={<AccountForm />}
                    buttonIcon={<AddIcon />}
                />
                <AccountList />
            </div>
            <Divider />
            {isPending ? <CircularProgress /> :
                <MoniLineChart accountStatisticsData={data} />
            }
            { error && <MoniBanner style='warning'>Some went wrong while fetching the statistics data!</MoniBanner>} 
        </section>
    );
}

export default Accounts;
