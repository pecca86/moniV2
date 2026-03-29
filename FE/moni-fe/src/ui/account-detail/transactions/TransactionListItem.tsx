import { Transaction } from '../../../types/global';
import { useSelection } from './TransactionSelectionContext';
import { formatToStandardEuDate } from '../../../utils/date-utils';

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

    const isWithdrawal = tr.transaction_type.toLowerCase() === 'withdrawal';

    return (
        <tr
            onClick={handleClicked}
            className={`border-b border-[#E3E8EF] last:border-b-0 text-xs cursor-pointer transition-colors ${
                isSelected
                    ? 'bg-[#EEF4FF]'
                    : 'bg-white hover:bg-[#F6F9FC]'
            }`}
            id={`${tr.id}`}
        >
            <td className="px-4 py-2.5 text-[#697386] whitespace-nowrap">{formatToStandardEuDate(tr.transaction_date)}</td>
            <td className="px-4 py-2.5 text-[#3C4257] truncate max-w-[160px]">{tr.description}</td>
            <td className="px-4 py-2.5 text-[#697386]">{tr.transaction_category}</td>
            <td className={`px-4 py-2.5 font-medium text-right ${isWithdrawal ? 'text-[#DF1B41]' : 'text-[#09825D]'}`}>
                {isWithdrawal ? '−' : '+'}{Math.abs(tr.sum)} €
            </td>
        </tr>
    );
}

export default TransactionListItem;
