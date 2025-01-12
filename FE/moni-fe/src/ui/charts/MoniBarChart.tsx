import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchAccountCategoryStatistics } from '../../hooks/statistics/useFetchAccountCategoryStatistics';
import { useParams } from 'react-router-dom';
import MoniBanner from '../banners/MoniBanner';
import { CircularProgress } from '@mui/material';
import { useUser } from '../../hooks/auth/useUser';

const MoniBarChart = () => {
    const { accountId } = useParams();
    const { token } = useUser();
    if (!accountId) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='warning'>Failed to get account data...</MoniBanner>
            </div>
        )
    }

    const { isPending, data, error } = useFetchAccountCategoryStatistics(accountId, token);


    if (isPending) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='info'>Fetching account statistics...</MoniBanner>
                <CircularProgress />
            </div>
        )
    }

    if (!isPending && error) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='warning'>Failed to get statistics for account!</MoniBanner>
            </div>
        )
    }

    if (!isPending && !error && !data) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='info'>No data available...</MoniBanner>
            </div>
        )
    }

    let chartData = [];
    // format [{name: string, sum: number}]
    for (let d of Object.keys(data?.data)) {
        let dp = {
            name: d.substring(0, 4).toLowerCase(),
            sum: data.data[d]
        }
        chartData.push(dp);
    }

    return (
        <>
            <div className='bg-white rounded-lg p-1 shadow-md'>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sum" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

export default MoniBarChart;
