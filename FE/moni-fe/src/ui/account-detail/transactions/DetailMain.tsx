import { useState } from 'react';
import Panel from './Panel';
import TransactionList from './TransactionList';
import { TransactionSelectionProvider } from './TransactionSelectionContext';
import TimeSpans from '../timespans/TimeSpans';
import MoniDoughnutChart from '../../charts/MoniDoughnutChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

type ExpandedChart = 'income' | 'spending' | null;

const DetailMain = () => {
    const [timeSpansExpanded, setTimeSpansExpanded] = useState(true);
    const [expandedChart, setExpandedChart] = useState<ExpandedChart>(null);

    const handleChartExpand = (chart: 'income' | 'spending') => {
        setExpandedChart((prev) => (prev === chart ? null : chart));
    };

    const chartWrapperStyle = (chart: 'income' | 'spending'): React.CSSProperties => {
        const isHidden = expandedChart !== null && expandedChart !== chart;
        return {
            flex: isHidden ? '0 0 0px' : '1',
            maxWidth: isHidden ? '0px' : '100%',
            opacity: isHidden ? 0 : 1,
            overflow: 'hidden',
            transition: 'flex 600ms ease-in-out, max-width 600ms ease-in-out, opacity 400ms ease-in-out',
            minWidth: 0,
        };
    };

    return (
        <div className="flex flex-col gap-6">
            <Panel />

            {/* Time spans */}
            <div className="stripe-card">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-[#3C4257]">Time spans</h2>
                    <button
                        onClick={() => setTimeSpansExpanded((v) => !v)}
                        className="text-[#697386] hover:text-[#1A1F36] transition-colors duration-200"
                        aria-label={timeSpansExpanded ? 'Minimize time spans' : 'Expand time spans'}
                    >
                        {timeSpansExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </button>
                </div>
                <div
                    className="overflow-hidden"
                    style={{
                        maxHeight: timeSpansExpanded ? '2000px' : '0px',
                        opacity: timeSpansExpanded ? 1 : 0,
                        transition: 'max-height 700ms ease-in-out, opacity 700ms ease-in-out',
                    }}
                >
                    <TimeSpans />
                </div>
                {!timeSpansExpanded && (
                    <p className="text-sm text-[#697386] mt-1">Click to expand time spans</p>
                )}
            </div>

            {/* Charts — always mounted for smooth transitions */}
            <div className="flex gap-4">
                <div style={chartWrapperStyle('income')}>
                    <div
                        className={`stripe-card h-full ${expandedChart !== 'income' ? 'cursor-pointer hover:shadow-stripe transition-shadow duration-200' : ''}`}
                        onClick={expandedChart !== 'income' ? () => handleChartExpand('income') : undefined}
                        title={expandedChart !== 'income' ? 'Click to expand' : undefined}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-[#09825D]">Income by category</h2>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleChartExpand('income'); }}
                                className="text-[#697386] hover:text-[#1A1F36] transition-colors duration-200"
                                aria-label={expandedChart === 'income' ? 'Collapse chart' : 'Expand chart'}
                            >
                                {expandedChart === 'income'
                                    ? <CloseFullscreenIcon fontSize="small" />
                                    : <OpenInFullIcon fontSize="small" />}
                            </button>
                        </div>
                        <MoniDoughnutChart filter="income" showLegend={expandedChart === 'income'} />
                    </div>
                </div>

                <div style={chartWrapperStyle('spending')}>
                    <div
                        className={`stripe-card h-full ${expandedChart !== 'spending' ? 'cursor-pointer hover:shadow-stripe transition-shadow duration-200' : ''}`}
                        onClick={expandedChart !== 'spending' ? () => handleChartExpand('spending') : undefined}
                        title={expandedChart !== 'spending' ? 'Click to expand' : undefined}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-[#DF1B41]">Spending by category</h2>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleChartExpand('spending'); }}
                                className="text-[#697386] hover:text-[#1A1F36] transition-colors duration-200"
                                aria-label={expandedChart === 'spending' ? 'Collapse chart' : 'Expand chart'}
                            >
                                {expandedChart === 'spending'
                                    ? <CloseFullscreenIcon fontSize="small" />
                                    : <OpenInFullIcon fontSize="small" />}
                            </button>
                        </div>
                        <MoniDoughnutChart filter="spending" showLegend={expandedChart === 'spending'} />
                    </div>
                </div>
            </div>

            {/* Transactions — always full width */}
            <TransactionSelectionProvider>
                <TransactionList timeSpanTransactions={undefined} />
            </TransactionSelectionProvider>
        </div>
    );
};

export default DetailMain;
