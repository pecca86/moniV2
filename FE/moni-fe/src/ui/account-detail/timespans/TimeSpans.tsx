import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TransactionList from '../transactions/TransactionList';
import AddModal from '../../cta/AddModal';
import TimeSpanForm from './TimeSpanForm';
import { TransactionSelectionProvider } from '../transactions/TransactionSelectionContext';
import { useFetchTransactions } from '../../../hooks/transaction/useFetchTransactions';
import { useFetchTimeSpansForAccount } from '../../../hooks/timespan/useFetchTimeSpansForAccount';
import MoniBanner from '../../banners/MoniBanner';
import { CircularProgress } from '@mui/material';
import { TimeSpan, Transaction } from '../../../types/global';
import { useParams } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import { Delete } from '@mui/icons-material';
import TimeSpanDeleteForm from './TimeSpanDeleteForm';
import { Divider } from "@mui/material";
import { formatToStandardEuDate } from '../../../utils/date-utils';

const TimeSpans = () => {

    const { accountId } = useParams<{ accountId: string }>();
    const { isPending, transactions, error } = useFetchTransactions(accountId);
    const { isPending: isFetchingTimeSpans, timeSpans, error: timeSpanError } = useFetchTimeSpansForAccount(accountId);

    if (isPending || isFetchingTimeSpans) {
        return (
            <div className="flex items-center justify-center">
                <MoniBanner style='info'>Fetching transactions...</MoniBanner>
                <CircularProgress />
            </div>
        )
    }

    if (timeSpans?.status === 'BAD_REQUEST') {
        return (
            <div className='flex justify-center items-center'>
                <MoniBanner style='warning'>Failed to fetch time spans</MoniBanner>
            </div>
        )
    }


    if ((!isPending || isFetchingTimeSpans) && (error || timeSpanError) && (timeSpans?.status === 'BAD_REQUEST')) {
        return <MoniBanner style="warning">There was a problem fetching the transaction data, please try again
            later!</MoniBanner>
    }

    function isBewteenDates(fromDate: string, toDate: string, transactionDate: string): boolean {
        let from = new Date(fromDate);
        let to = new Date(toDate);
        let targetDate = new Date(transactionDate);

        return targetDate >= from && targetDate <= to;
    }

    function filterTransactionsByDateSpan(timespan: TimeSpan): Transaction[] | undefined {
        return transactions.transactions.content?.filter((tr: { transaction_date: string; }) => isBewteenDates(timespan.from, timespan.to, tr.transaction_date));
    }



    return (
        <div className='pt-2 pr-2'>
            <div className='mb-2'>
                <AddModal
                    ctaText='Add Time Span'
                    heading='Add a new time span'
                    paragraph='Fill in the form below to add a new time span'
                    form={<TimeSpanForm />}
                    buttonIcon={<Add />}
                />
            </div>

            {timeSpans && timeSpans?.length <= 0 ? (
                <div><MoniBanner style='info'>Please add a new time span from the button above!</MoniBanner></div>
            ) : (
                <div>
                    {timeSpans?.map((t: { id?: any; from: any; to: any; }) => {
                        let filteredTransactions = filterTransactionsByDateSpan(t);
                        let dateSpanSum = filteredTransactions?.reduce((acc, curr) => acc + curr.sum, 0);
                        let income = filteredTransactions?.filter(tr => tr.transaction_type === 'DEPOSIT').reduce((acc, curr) => acc + curr.sum, 0);
                        let spendings = filteredTransactions?.filter(tr => tr.transaction_type === 'WITHDRAWAL').reduce((acc, curr) => acc + curr.sum, 0);
                        return (
                            <div key={t.id}>
                                {/* ACCORDION 1 */}
                                <Accordion key={t.id}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <div className='flex gap-5'>
                                            <span>{formatToStandardEuDate(t.from)} - {formatToStandardEuDate(t.to)}</span> <span
                                                className={`${dateSpanSum && dateSpanSum >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}`}>{dateSpanSum} €</span>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {transactions.transactions.content.length > 0 ? (
                                            <div>
                                                <AddModal
                                                    ctaText='Delete Time Span'
                                                    heading='Delete Time Span'
                                                    paragraph='Delete the selected time span, this cannot be undone!'
                                                    form={<TimeSpanDeleteForm handleClose={null} timeSpanId={t.id} />}
                                                    buttonIcon={<Delete />}
                                                    ctaStyle='bg-red-500 my-2'
                                                />
                                                {/* TODO: Make a info panel component here */}
                                                <div className='flex flex-col gap-1 mb-2'>
                                                    <span className='text-green-600'><span
                                                        className='font-medium'>Incomes:</span> {income} €</span>
                                                    <span className='text-red-500'><span
                                                        className='font-medium'>Spendings:</span> {spendings} €</span>
                                                </div>
                                                <Divider sx={{ margin: '10px' }} />
                                                <TransactionSelectionProvider>
                                                    <TransactionList timeSpanTransactions={filteredTransactions} />
                                                </TransactionSelectionProvider>
                                            </div>

                                        ) : (
                                            <MoniBanner style='info'>No transactions in this time span</MoniBanner>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        )
                    })}
                </div>

            )}


        </div>
    );
}

export default TimeSpans;
