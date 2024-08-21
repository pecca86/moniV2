import AddModal from "../cta/AddModal";
import TransactionListItem from "./TransactionListItem";
import TransactionForm from "./transactions/TransactionForm";

const TransactionList = () => {
    return (
        <div className='bg-purple-300 col-span-3'>
            <AddModal
                ctaText="Add Transaction"
                heading='Add a new transaction'
                paragraph='Fill in the form below to add a new transaction'
                form={<TransactionForm />}
            />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
        </div>
    );
}

export default TransactionList;
