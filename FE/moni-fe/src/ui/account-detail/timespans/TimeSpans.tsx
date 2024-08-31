import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TransactionList from '../transactions/TransactionList';
import AddModal from '../../cta/AddModal';
import TimeSpanForm from './TimeSpanForm';
import { TransactionSelectionProvider } from '../transactions/TransactionSelectionContext';
import { useFetchTransactions } from '../../../hooks/transaction/useFetchTransactions';
import MoniBanner from '../../banners/MoniBanner';
import { CircularProgress } from '@mui/material';
import { Transaction } from '../../../types/global';

const fakeData = [
    {
        id: 1,
        transaction_type: 'DEPOSIT',
        sum: 99,
        transaction_date: '2023-08-12',
        transaction_category: 'SAVINGS',
        description: "FROM THE TIMESPAN!"
    }
]
const TimeSpans = () => {

    const { isPending, transactions, error } = useFetchTransactions();

    if (isPending) {
        return (
            <div className="flex items-center justify-center">
                <MoniBanner style='info'>Fetching transactions...</MoniBanner>
                <CircularProgress />
            </div>
        )
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the transaction data, please try again later!</MoniBanner>
    }

    function isBewteenDates(fromDate: string, toDate: string, transactionDate: string): boolean {
        let from = new Date(fromDate);
        let to = new Date(toDate);
        let targetDate = new Date(transactionDate);

        return targetDate >= from && targetDate <= to;
    }

    function filterTransactionsByDateSpan(): Transaction[] | undefined {
        console.log("ORIGINAL LIST: ", transactions);
        let filteredTransactions = transactions?.filter(tr => isBewteenDates('2024-08-12', '2025-08-12', tr.transaction_date));
        console.log("FILTERED LIST: ", filteredTransactions);
        return filteredTransactions;
    }

    return (
        <div className='pt-2 pr-2'>
            <AddModal
                ctaText='Add Time Span'
                heading='Add a new time span'
                paragraph='Fill in the form below to add a new time span'
                form={<TimeSpanForm />}
            />

            {/* ACCORDION 1 */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <div className='flex gap-2'>
                        <span>12.8.2023 - 12.8.2024</span> <span>140 €</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {/* TODO: Make a info panel component here */}
                    <div className='flex flex-col gap-1 mb-1'>
                        <span>Incomes: 400€</span>
                        <span>Spendings: -100€</span>
                        <span>With current balance: 300€</span>
                    </div>
                    <TransactionSelectionProvider>
                        <TransactionList timeSpanTransactions={filterTransactionsByDateSpan()} />
                    </TransactionSelectionProvider>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default TimeSpans;
