import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const TransactionOperations = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sort, setSort] = useState('date');
    const activeFilter = searchParams.get('filter') || 'all';

    const handleFilter = (filterValue: string) => {
        searchParams.set('filter', filterValue);
        setSearchParams(searchParams);
    }

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSort(value);
        searchParams.set('sort', value);
        setSearchParams(searchParams);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            searchParams.set('search', e.target.value);
            setSearchParams(searchParams);
        }, 300);
    }

    const filterBtns = [
        { value: 'all', label: 'All' },
        { value: 'deposit', label: 'Income' },
        { value: 'withdrawal', label: 'Expense' },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-3 py-3">
            <input
                onChange={handleSearch}
                type="text"
                placeholder="Search by description..."
                className="stripe-input flex-1 min-w-0"
            />
            <div className="flex gap-2 flex-shrink-0">
                <select
                    value={sort}
                    onChange={handleSort}
                    className="stripe-input py-2 pr-8 text-sm"
                >
                    <option value="date">Sort: Date</option>
                    <option value="sum">Sort: Sum</option>
                    <option value="category">Sort: Category</option>
                    <option value="type">Sort: Type</option>
                    <option value="description">Sort: Description</option>
                </select>
                <div className="flex rounded-lg border border-[#E3E8EF] overflow-hidden bg-white text-sm">
                    {filterBtns.map(btn => (
                        <button
                            key={btn.value}
                            onClick={() => handleFilter(btn.value)}
                            className={`px-3 py-2 font-medium transition-colors ${
                                activeFilter === btn.value
                                    ? 'bg-[#635BFF] text-white'
                                    : 'text-[#697386] hover:bg-[#F6F9FC] hover:text-[#1A1F36]'
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TransactionOperations;
