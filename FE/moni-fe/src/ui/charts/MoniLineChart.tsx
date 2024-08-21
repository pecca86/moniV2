import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MoniLineChart = () => {
    const data: any[] = [
        {
            name: 'Jan',
            savings: 4000,
            deposit: 2400,
            amt: 2400,
        },
        {
            name: 'Feb',
            savings: 3000,
            deposit: 1398,
            amt: 2210,
        },
        {
            name: 'Mar',
            savings: 2000,
            deposit: 9800,
            amt: 2290,
        },
        {
            name: 'Apr',
            savings: 2780,
            deposit: 3908,
            amt: 2000,
        },
        {
            name: 'May',
            savings: 1890,
            deposit: 4800,
            amt: 2181,
        },
        {
            name: 'Jun',
            savings: 2390,
            deposit: 3800,
            amt: 2500,
        },
        {
            name: 'Jul',
            savings: 3490,
            deposit: 4300,
            amt: 2100,
        },
        {
            name: 'Sept',
            savings: 3490,
            deposit: 4300,
            amt: 2100,
        },
        {
            name: 'Oct',
            savings: 3490,
            deposit: 4300,
            amt: 2100,
        },
        {
            name: 'Nov',
            savings: 3490,
            deposit: 4300,
            amt: 2100,
        },
        {
            name: 'Dec',
            savings: 3490,
            deposit: 4300,
            amt: 2100,
        },
    ];

    return (
        <div className='bg-gray-50'>
            <p>
                <label htmlFor="with-balance">With balance</label>
                <input type="checkbox" name="with-balance" id="" />
            </p>
            <ResponsiveContainer width={340} height={300}>
                <LineChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="deposit"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MoniLineChart;
