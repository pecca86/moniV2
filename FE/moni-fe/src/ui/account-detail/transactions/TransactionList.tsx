import AddModal from "../../cta/AddModal";
import TransactionListItem from "./TransactionListItem";
import TransactionForm from "./TransactionForm";
import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import TransactionOperations from "./TransactionOperations";
import { useSearchParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { useFetchTransactions } from "../../../hooks/transaction/useFetchTransactions";
import CircularProgress from '@mui/material/CircularProgress';
import MoniBanner from "../../banners/MoniBanner";
import DeleteSelectedTransactionsForm from "./DeleteSelectedTransactionsForm";
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { useState } from "react";

const TransactionList = () => {

    const { isPending, transactions, error } = useFetchTransactions();
    const [searchParams] = useSearchParams();

    // grab the filter value from the URL that has been set by our TransactionOperations component
    const filterValue = searchParams.get('filter') || 'all';
    const sortValue = searchParams.get('sort') || 'date';
    const searchValue = searchParams.get('search') || '';
    const [selectedValues, setSelectedValues] = useState<Set<number>>(new Set());

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

    function handleTransactionItemSelected(id: number) {
        if (selectedValues.has(id)) {
            setSelectedValues(() => {
                const newSet = new Set(selectedValues);
                newSet.delete(id);
                return newSet;
            });
        } else {
            setSelectedValues(() => {
                const newSet = new Set(selectedValues);
                newSet.add(id);
                return newSet;
            });
        }
    }

    function handleEmptyIdSet() {
        setSelectedValues(new Set());
    }

    const tableHeaderStyle = "px-2 py-1";

    return (
        <div className=''>
            <div className="flex justify-between">
                {selectedValues.size >= 1 ? (
                    <button onClick={handleEmptyIdSet} className="hover:bg-blue-600 bg-violet-500 text-white font-bold py-2 px-4 rounded"><RemoveDoneIcon /> Deselect</button>
                ) : (

                    <AddModal
                        ctaText="Add"
                        heading='Add a new transaction'
                        paragraph='Fill in the form below to add a new transaction'
                        form={<TransactionForm />}
                        buttonIcon={<Add />}
                    />
                )}
                {(selectedValues.size > 0 && selectedValues.size < 2) && (
                    <AddModal
                        ctaText="Update"
                        heading='Update the selected transaction'
                        paragraph=''
                        form={<TransactionForm ids={selectedValues} onHandleEmptyIdSet={handleEmptyIdSet} />}
                        buttonIcon={<Edit />}
                        ctaStyle={`bg-yellow-400`}
                    />
                )}
                <AddModal
                    ctaText="Delete"
                    heading='Are you sure you want to delete the selected transactions?'
                    paragraph='This operation cannot be undone!'
                    form={<DeleteSelectedTransactionsForm ids={selectedValues} onHandleEmptyIdSet={handleEmptyIdSet} />}
                    buttonIcon={<Delete />}
                    ctaStyle={`${selectedValues.size > 0 ? 'bg-red-400' : 'hidden'} `}
                />

            </div>
            {transactions?.length === 0 && <MoniBanner style="info">Click the 'add transaction' button above, to create a new transaction!</MoniBanner>}
            <TransactionOperations />
            <Divider />

            <div className="relative overflow-x-auto shadow-lg rounded-lg h-full max-h-[450px] overflow-scroll">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900 table-fixed">
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
                            <TransactionListItem key={transaction.id} tr={transaction} onSelect={handleTransactionItemSelected} />))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList;
