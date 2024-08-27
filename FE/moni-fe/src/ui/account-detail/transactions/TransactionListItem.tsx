import { Transaction } from '../../../types/global';
import { useState, useEffect } from 'react';

const TransactionListItem = ({ tr, onSelect, deselect, onRender }: { tr: Transaction, onSelect: any, deselect: boolean, onRender: any }) => {

    const [selected, setSelected] = useState(false);

    const tableHeaderStyle = "px-1 py-2";
    const withdrawalStyle = "text-red-500";
    const depositStyle = "text-green-500";

    const handleClicked = () => {
        setSelected(!selected);
        onSelect(tr.id);
    }

    useEffect(() => {
        if (deselect) {
            setSelected(false);
        }
        onRender(); // so we can do this operation more than once
    }, [deselect, onRender]);

    return (
        <tr onClick={handleClicked} className={`${selected ? 'bg-violet-400': 'bg-white'} border-b text-xs font-light sm:hover:cursor-pointer sm:hover:bg-purple-300 sm:hover:text-white `}id={`${tr.id}`}>
            <th scope="col" className={tableHeaderStyle}>{tr.transaction_date}</th>
            <th scope="col" className={tableHeaderStyle}>{tr.description}</th>
            <th scope="col" className={tableHeaderStyle}>{tr.transaction_category}</th>
            <th className={`${tableHeaderStyle} ${tr.transaction_type.toLowerCase() === 'withdrawal' ? withdrawalStyle : depositStyle}`}>{tr.sum} €</th>
        </tr>
    );
}

export default TransactionListItem;
