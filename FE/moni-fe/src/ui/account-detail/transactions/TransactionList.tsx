import AddModal from "../../cta/AddModal";
import TransactionListItem from "./TransactionListItem";
import TransactionForm from "./TransactionForm";
import Add from "@mui/icons-material/Add";
import TransactionOperations from "./TransactionOperations";
import { useSearchParams } from "react-router-dom";
import { Divider } from "@mui/material";

const TransactionList = () => {

    const transactions: Array<Transaction> = [
        {
            id: 1,
            sum: -40.50,
            description: 'Groceries',
            transaction_type: 'withdrawal',
            transaction_category: 'home',
            transaction_date: '2024-12-10'
        },
        {
            id: 2,
            sum: 1000,
            description: 'Salary',
            transaction_type: 'deposit',
            transaction_category: 'income',
            transaction_date: '2024-11-10'
        },
        {
            id: 3,
            sum: -20,
            description: 'Gas',
            transaction_type: 'withdrawal',
            transaction_category: 'car',
            transaction_date: '2024-10-10'
        }
    ]

    const [searchParams] = useSearchParams();

    // grab the filter value from the URL that has been set by our TransactionOperations component
    const filterValue = searchParams.get('filter') || 'all';
    const sortValue = searchParams.get('sort') || 'date';
    const searchValue = searchParams.get('search') || '';
    console.log(searchValue);

    let filteredTransactions: Array<Transaction> = [];

    switch (filterValue) {
        case 'all':
            filteredTransactions = transactions;
            break;
        case 'withdrawal':
            filteredTransactions = transactions.filter(tr => tr.transaction_type === 'withdrawal');
            break;
        case 'deposit':
            filteredTransactions = transactions.filter(tr => tr.transaction_type === 'deposit');
            break;
        default:
            filteredTransactions = transactions;
    }

    switch (sortValue) {
        case 'sum':
            filteredTransactions.sort((a, b) => a.sum - b.sum);
            break;
        case 'date':
            filteredTransactions.sort((a, b) => a.transaction_date.localeCompare(b.transaction_date));
            break;
        case 'category':
            filteredTransactions.sort((a, b) => a.transaction_category.localeCompare(b.transaction_category));
            break;
        case 'type':
            filteredTransactions.sort((a, b) => a.transaction_type.localeCompare(b.transaction_type));
            break;
        case 'description':
            filteredTransactions.sort((a, b) => a.description.localeCompare(b.description));
            break;
        default:
            filteredTransactions = filteredTransactions;
    }

    if (searchValue) {
        filteredTransactions = filteredTransactions.filter(tr => tr.description.toLowerCase().includes(searchValue.toLowerCase()));
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
            <TransactionOperations />
            <Divider />

            <div className="relative overflow-x-auto shadow-lg rounded-lg">
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
                        {filteredTransactions.map((transaction) => (
                            <TransactionListItem key={transaction.id} tr={transaction}/>))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList;
