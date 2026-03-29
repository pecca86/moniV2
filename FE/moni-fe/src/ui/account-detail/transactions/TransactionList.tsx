import AddModal from "../../cta/AddModal";
import TransactionListItem from "./TransactionListItem";
import TransactionForm from "./TransactionForm";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import TransactionOperations from "./TransactionOperations";
import { useSearchParams, useParams } from "react-router-dom";
import { useFetchTransactions } from "../../../hooks/transaction/useFetchTransactions";
import CircularProgress from '@mui/material/CircularProgress';
import MoniBanner from "../../banners/MoniBanner";
import DeleteSelectedTransactionsForm from "./DeleteSelectedTransactionsForm";
import { useSelection } from "./TransactionSelectionContext";
import { formatToStandardEuDate } from "../../../utils/date-utils";
import DeleteOldTransactionsForm from "./DeleteOldTransactionsForm";
import { Transaction } from "../../../types/global";
import { useUser } from "../../../hooks/auth/useUser";

type Props = {
    timeSpanTransactions: Transaction[] | undefined;
};

const TransactionList = ({ timeSpanTransactions }: Props) => {
    const { token } = useUser();
    const [searchParams] = useSearchParams();
    const { dispatch, selections }: { dispatch: any, selections: number[] } = useSelection();

    const filterValue = searchParams.get('filter') || 'all';
    const sortValue = searchParams.get('sort') || 'date';
    const searchValue = searchParams.get('search') || '';

    let transactionsData: any[] = [];

    if (!timeSpanTransactions) {
        const { accountId } = useParams<{ accountId: string }>();
        const { isPending, transactions, error } = useFetchTransactions(accountId as string, token);

        if (isPending) {
            return (
                <div className="flex items-center justify-center py-12">
                    <CircularProgress size={24} sx={{ color: '#635BFF' }} />
                </div>
            );
        }

        if (!isPending && error) {
            return <MoniBanner style="warning">There was a problem fetching the transaction data, please try again later!</MoniBanner>;
        }

        transactionsData = transactions.transactions?.content;
    } else {
        transactionsData = timeSpanTransactions;
    }

    let filteredTransactions = transactionsData;

    switch (filterValue) {
        case 'withdrawal':
            filteredTransactions = transactionsData?.filter(tr => tr.transaction_type.toLowerCase() === 'withdrawal');
            break;
        case 'deposit':
            filteredTransactions = transactionsData?.filter(tr => tr.transaction_type.toLowerCase() === 'deposit');
            break;
    }

    switch (sortValue) {
        case 'sum':
            filteredTransactions?.sort((a, b) => a.sum - b.sum);
            break;
        case 'date':
            filteredTransactions?.sort((a, b) => a.transaction_date.localeCompare(b.transaction_date));
            break;
        case 'category':
            filteredTransactions?.sort((a, b) => a.transaction_category.localeCompare(b.transaction_category));
            break;
        case 'type':
            filteredTransactions?.sort((a, b) => a.transaction_type.localeCompare(b.transaction_type));
            break;
        case 'description':
            filteredTransactions?.sort((a, b) => a.description.localeCompare(b.description));
            break;
    }

    if (searchValue) {
        filteredTransactions = filteredTransactions?.filter(tr =>
            tr.description.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    function handleEmptyIdSet() {
        dispatch({ type: 'RESET' });
    }

    return (
        <div className="stripe-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1F36]">Transactions</h2>
                <div className="flex gap-2 flex-wrap justify-end">
                    {selections.length >= 1 ? (
                        <button onClick={handleEmptyIdSet} className="stripe-btn-secondary text-xs py-1.5">
                            <RemoveDoneIcon fontSize="small" /> Deselect
                        </button>
                    ) : (
                        <>
                            <AddModal
                                ctaText="Add"
                                heading="Add a new transaction"
                                paragraph="Fill in the form below to add a new transaction"
                                form={<TransactionForm mode='add' handleClose={undefined} />}
                                buttonIcon={<AddIcon fontSize="small" />}
                            />
                            <AddModal
                                ctaText="Delete old"
                                heading="Delete old transactions"
                                paragraph={`This will delete all transactions older than ${formatToStandardEuDate(new Date().toISOString())}`}
                                form={<DeleteOldTransactionsForm handleClose={undefined} />}
                                buttonIcon={<DeleteIcon fontSize="small" />}
                                ctaStyle="bg-red-400"
                            />
                        </>
                    )}
                    {selections.length === 1 && (
                        <AddModal
                            ctaText="Edit"
                            heading="Update transaction"
                            paragraph=""
                            form={
                                <TransactionForm
                                    ids={selections}
                                    mode='edit'
                                    handleClose={handleEmptyIdSet}
                                    transactionData={transactionsData?.find(tr => tr.id === selections[0])}
                                />
                            }
                            buttonIcon={<EditIcon fontSize="small" />}
                            ctaStyle="bg-yellow-400"
                        />
                    )}
                    {selections.length > 1 && (
                        <AddModal
                            ctaText="Edit"
                            heading="Update selected transactions"
                            paragraph={`${selections.length} transactions selected`}
                            form={
                                <TransactionForm
                                    ids={selections}
                                    handleClose={handleEmptyIdSet}
                                    mode='edit-many'
                                />
                            }
                            buttonIcon={<EditIcon fontSize="small" />}
                            ctaStyle="bg-yellow-400"
                        />
                    )}
                    <AddModal
                        ctaText="Delete"
                        heading="Delete selected transactions?"
                        paragraph={`${selections.length} transaction/s selected`}
                        form={<DeleteSelectedTransactionsForm ids={selections} onHandleEmptyIdSet={handleEmptyIdSet} handleClose={undefined} />}
                        buttonIcon={<DeleteIcon fontSize="small" />}
                        ctaStyle={`${selections.length > 0 ? 'bg-red-400' : 'hidden'}`}
                    />
                </div>
            </div>

            {transactionsData?.length === 0 && (
                <MoniBanner style="info">Click 'Add' to create your first transaction!</MoniBanner>
            )}

            <TransactionOperations />

            <div className="rounded-lg border border-[#E3E8EF] overflow-hidden">
                <div className="max-h-[450px] overflow-y-auto">
                    <table className="w-full text-sm table-fixed">
                        <thead className="sticky top-0">
                            <tr className="bg-[#F6F9FC] border-b border-[#E3E8EF]">
                                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#697386] uppercase tracking-wide w-24">Date</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#697386] uppercase tracking-wide">Description</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#697386] uppercase tracking-wide w-28">Category</th>
                                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#697386] uppercase tracking-wide w-24">Sum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions?.map((transaction) => (
                                <TransactionListItem key={transaction.id} tr={transaction} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TransactionList;
