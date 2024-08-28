import { Transaction } from '../../../types/global';
import { useSelection } from './TransactionSelectionContext';

const TransactionListItem = ({ tr }: { tr: Transaction }) => {
    const { dispatch, selections } = useSelection();

    const isSelected = selections.includes(tr.id);

    const handleClicked = () => {
        if (isSelected) {
            dispatch({ type: "REMOVE", payload: tr.id });
        } else {
            dispatch({ type: "ADD", payload: tr.id });
        }
    }
    
    const tableHeaderStyle = "px-1 py-2";
    const withdrawalStyle = "text-red-500";
    const depositStyle = "text-green-500";

    return (
        <tr onClick={handleClicked} className={`${isSelected ? 'bg-violet-400' : 'bg-white'} border-b text-xs font-light sm:hover:cursor-pointer sm:hover:bg-purple-300 sm:hover:text-white `} id={`${tr.id}`}>
            <th scope="col" className={tableHeaderStyle}>{tr.transaction_date}</th>
            <th scope="col" className={tableHeaderStyle}>{tr.description}</th>
            <th scope="col" className={tableHeaderStyle}>{tr.transaction_category}</th>
            <th className={`${tableHeaderStyle} ${tr.transaction_type.toLowerCase() === 'withdrawal' ? withdrawalStyle : depositStyle}`}>{tr.sum} €</th>
        </tr>
    );
}

export default TransactionListItem;
