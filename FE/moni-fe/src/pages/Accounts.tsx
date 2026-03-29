import AccountList from '../ui/accounts/AccountList';
import MoniLineChart from '../ui/charts/MoniLineChart';
import AddModal from '../ui/cta/AddModal';
import AccountForm from '../ui/accounts/AccountForm';
import AddIcon from '@mui/icons-material/Add';
import { useFetchAllAccountsStatistics } from '../hooks/statistics/useFetchAllAccountsStatistics';
import { CircularProgress } from '@mui/material';
import MoniBanner from '../ui/banners/MoniBanner';
import { useUser } from '../hooks/auth/useUser';

const Accounts = () => {
    const { token } = useUser();
    const { isPending, data, error } = useFetchAllAccountsStatistics(token);

    return (
        <div className='max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-[#1A1F36]'>Accounts</h1>
                    <p className='text-sm text-[#697386] mt-0.5'>Manage your financial accounts</p>
                </div>
                <AddModal
                    ctaText='Add account'
                    heading='Add a new account'
                    paragraph='Fill in the form below to add a new account'
                    form={<AccountForm handleClose={undefined} update={false} accountData={undefined} />}
                    buttonIcon={<AddIcon fontSize="small" />}
                />
            </div>

            <AccountList />

            {isPending ? (
                <div className="flex justify-center py-8">
                    <CircularProgress size={24} sx={{ color: '#635BFF' }} />
                </div>
            ) : (
                <div className="stripe-card">
                    <h2 className="text-sm font-semibold text-[#3C4257] mb-4">Balance over time</h2>
                    <MoniLineChart accountStatisticsData={data} />
                </div>
            )}

            {error && <MoniBanner style='warning'>Something went wrong while fetching statistics!</MoniBanner>}
        </div>
    );
}

export default Accounts;
