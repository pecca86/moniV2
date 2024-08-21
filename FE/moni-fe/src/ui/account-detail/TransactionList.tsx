import TransactionListItem
 from "./TransactionListItem";
const TransactionList = () => {
    return (
        <div className='bg-purple-300 col-span-2'>
            TransactionList
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
        </div>
    );
}

export default TransactionList;
