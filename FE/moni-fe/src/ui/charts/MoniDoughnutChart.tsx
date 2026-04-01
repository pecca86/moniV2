import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchAccountCategoryStatistics } from '../../hooks/statistics/useFetchAccountCategoryStatistics';
import { useParams } from 'react-router-dom';
import MoniBanner from '../banners/MoniBanner';
import { CircularProgress } from '@mui/material';
import { useUser } from '../../hooks/auth/useUser';

const COLORS = ['#635BFF', '#09825D', '#DF1B41', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

interface MoniDoughnutChartProps {
    showLegend?: boolean;
    filter: 'income' | 'spending';
}

const MoniDoughnutChart = ({ showLegend = false, filter }: MoniDoughnutChartProps) => {
    const { accountId } = useParams();
    const { token } = useUser();

    if (!accountId) {
        return <MoniBanner style='warning'>Failed to get account data...</MoniBanner>;
    }

    const { isPending, data, error } = useFetchAccountCategoryStatistics(accountId, token);

    if (isPending) {
        return (
            <div className="flex justify-center py-6">
                <CircularProgress size={24} sx={{ color: '#635BFF' }} />
            </div>
        );
    }

    if (error) {
        return <MoniBanner style='warning'>Failed to get statistics for account!</MoniBanner>;
    }

    if (!data) {
        return <MoniBanner style='info'>No data available</MoniBanner>;
    }

    const chartData = Object.keys(data.data)
        .filter((key) => filter === 'income' ? data.data[key] > 0 : data.data[key] < 0)
        .map((key) => ({
            name: key.toLowerCase(),
            value: Math.abs(data.data[key]),
        }));

    if (chartData.length === 0) {
        return <MoniBanner style='info'>No {filter} data available</MoniBanner>;
    }

    const tooltipFormatter = (value: number) =>
        filter === 'spending' ? `-${value} €` : `${value} €`;

    return (
        <ResponsiveContainer width="100%" height={240}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                {showLegend && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default MoniDoughnutChart;
