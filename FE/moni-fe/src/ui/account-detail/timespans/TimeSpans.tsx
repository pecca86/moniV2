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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TimeSpanDeleteForm from './TimeSpanDeleteForm';
import { formatToStandardEuDate } from '../../../utils/date-utils';
import { useUser } from '../../../hooks/auth/useUser';

const TimeSpans = () => {
    const { token } = useUser();
    const { accountId } = useParams<{ accountId: string }>();
    const { isPending, transactions, error } = useFetchTransactions(accountId, token);
    const { isPending: isFetchingTimeSpans, timeSpans, error: timeSpanError } = useFetchTimeSpansForAccount(accountId, token);

    if (isPending || isFetchingTimeSpans) {
        return (
            <div className="flex items-center justify-center py-12">
                <CircularProgress size={24} sx={{ color: '#635BFF' }} />
            </div>
        );
    }

    if (timeSpans?.status === 'BAD_REQUEST' || (error && timeSpanError)) {
        return <MoniBanner style="warning">Failed to fetch time spans</MoniBanner>;
    }

    function isBetweenDates(fromDate: string, toDate: string, transactionDate: string): boolean {
        return new Date(transactionDate) >= new Date(fromDate) && new Date(transactionDate) <= new Date(toDate);
    }

    function filterTransactionsByDateSpan(timespan: TimeSpan): Transaction[] | undefined {
        return transactions.transactions.content?.filter(
            (tr: { transaction_date: string }) => isBetweenDates(timespan.from, timespan.to, tr.transaction_date)
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1F36]">Time spans</h2>
                <AddModal
                    ctaText="Add time span"
                    heading="Add a new time span"
                    paragraph="Fill in the form below to add a new time span"
                    form={<TimeSpanForm />}
                    buttonIcon={<AddIcon fontSize="small" />}
                />
            </div>

            {!timeSpans || timeSpans?.length <= 0 ? (
                <MoniBanner style="info">Click 'Add time span' to create your first time span!</MoniBanner>
            ) : (
                <div className="flex flex-col gap-2">
                    {timeSpans?.map((t: { id?: any; from: any; to: any }) => {
                        const filteredTransactions = filterTransactionsByDateSpan(t);
                        const dateSpanSum = filteredTransactions?.reduce((acc, curr) => acc + curr.sum, 0) ?? 0;
                        const income = filteredTransactions?.filter(tr => tr.transaction_type === 'DEPOSIT').reduce((acc, curr) => acc + curr.sum, 0) ?? 0;
                        const spendings = filteredTransactions?.filter(tr => tr.transaction_type === 'WITHDRAWAL').reduce((acc, curr) => acc + curr.sum, 0) ?? 0;

                        return (
                            <Accordion
                                key={t.id}
                                sx={{
                                    border: '1px solid #E3E8EF',
                                    borderRadius: '12px !important',
                                    boxShadow: 'none',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': { margin: 0 }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#697386' }} />}
                                    sx={{ '& .MuiAccordionSummary-content': { margin: '12px 0' } }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-[#1A1F36]">
                                            {formatToStandardEuDate(t.from)} — {formatToStandardEuDate(t.to)}
                                        </span>
                                        <span className={`text-sm font-semibold ${dateSpanSum >= 0 ? 'text-[#09825D]' : 'text-[#DF1B41]'}`}>
                                            {dateSpanSum >= 0 ? '+' : ''}{dateSpanSum} €
                                        </span>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderTop: '1px solid #E3E8EF', padding: '16px' }}>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-6 text-sm">
                                                <span className="text-[#697386]">
                                                    Income: <span className="font-semibold text-[#09825D]">{income} €</span>
                                                </span>
                                                <span className="text-[#697386]">
                                                    Spending: <span className="font-semibold text-[#DF1B41]">{spendings} €</span>
                                                </span>
                                            </div>
                                            <AddModal
                                                ctaText="Delete"
                                                heading="Delete time span"
                                                paragraph="This cannot be undone!"
                                                form={<TimeSpanDeleteForm handleClose={null} timeSpanId={t.id} />}
                                                buttonIcon={<DeleteIcon fontSize="small" />}
                                                ctaStyle="bg-red-500"
                                            />
                                        </div>
                                        <TransactionSelectionProvider>
                                            <TransactionList timeSpanTransactions={filteredTransactions} />
                                        </TransactionSelectionProvider>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TimeSpans;
