import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Hobbies',
        sum: 4000,
    },
    {
        name: 'Home',
        sum: -3000,
    },
    {
        name: 'Kids',
        sum: 2000,
    },
    {
        name: 'Savings',
        sum: 2780,
    },
    {
        name: 'Entertainment',
        sum: 1890,
    },
    {
        name: 'Salary',
        sum: 2390,
    },
    {
        name: 'Other',
        sum: 3490,
    },
];

const MoniBarChart = () => {
    return (
        <>
            <div className='bg-white rounded-lg p-1 shadow-md'>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
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
