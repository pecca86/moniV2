import AddModal from "../../cta/AddModal";
import TransactionListItem from "./TransactionListItem";
import TransactionForm from "./TransactionForm";
import Add from "@mui/icons-material/Add";
import TransactionOperations from "./TransactionOperations";
import { useSearchParams } from "react-router-dom";
import { Button, Divider } from "@mui/material";
import { useFetchTransactions } from "../../../hooks/transaction/useFetchTransactions";
import CircularProgress from '@mui/material/CircularProgress';
import MoniBanner from "../../banners/MoniBanner";

const TransactionList = () => {

    const { isPending, transactions, error } = useFetchTransactions();
    const [searchParams] = useSearchParams();

    // grab the filter value from the URL that has been set by our TransactionOperations component
    const filterValue = searchParams.get('filter') || 'all';
    const sortValue = searchParams.get('sort') || 'date';
    const searchValue = searchParams.get('search') || '';

    if (isPending) {
        return <div><CircularProgress /></div>
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the transaction data, please try again later!</MoniBanner>
    }


    let filteredTransactions = transactions;

    switch (filterValue) {
        case 'all':
            filteredTransactions = transactions;
            break;
        case 'withdrawal':
            filteredTransactions = transactions?.filter(tr => tr.transaction_type.toLowerCase() === 'withdrawal');
            break;
        case 'deposit':
            filteredTransactions = transactions?.filter(tr => tr.transaction_type.toLowerCase() === 'deposit');
            break;
        default:
            filteredTransactions = transactions;
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
        default:
            filteredTransactions = filteredTransactions;
    }

    if (searchValue) {
        filteredTransactions = filteredTransactions?.filter(tr => tr.description.toLowerCase().includes(searchValue.toLowerCase()));
    }

    const tableHeaderStyle = "px-2 py-1";

    return (
        <div className=''>

            <AddModal
                ctaText="Add Transaction"
                heading='Add a new transaction'
                paragraph='Fill in the form below to add a new transaction'
                form={<TransactionForm />}
                buttonIcon={<Add />}
            />
            { transactions?.length === 0 && <MoniBanner style="info">Click the 'add transaction' button above, to create a new transaction!</MoniBanner>}
            <TransactionOperations />
            <Divider />

            <div className="relative overflow-x-auto shadow-lg rounded-lg h-full max-h-[450px] overflow-scroll">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                    <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className={tableHeaderStyle}>
                                Date
                            </th>
                            <th scope="col" className={tableHeaderStyle}>
                                Description
                            </th>
                            <th scope="col" className={tableHeaderStyle}>
                                Category
                            </th>
                            <th scope="col" className={tableHeaderStyle}>
                                Sum
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions?.map((transaction) => (
                            <TransactionListItem key={transaction.id} tr={transaction} />))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList;
