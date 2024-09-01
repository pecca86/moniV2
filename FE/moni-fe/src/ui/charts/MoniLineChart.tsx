import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MoniToolTip from '../cta/MoniToolTip';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { AccountsStatisticData } from '../../types/global';

interface Props {
    accountStatisticsData: AccountsStatisticData
}

interface LineChartData {
    [key: string]: string;
    name?: string | undefined;
}

const MoniLineChart = ({accountStatisticsData}: Props) => {
    const newData: LineChartData[] = []

    // Create an initial data point, cointaing just the months in the same order we receive them from the server
    let dataPoint = {}
    Object.keys(accountStatisticsData.data[0].sumsPerMonth).forEach(key => {
        dataPoint = {
            name: key,
        }
        newData.push(dataPoint)
    });

    for (let i = 0; i < accountStatisticsData.data.length; i++) {
        let accountName = accountStatisticsData.data[i].account.name.trim()
        for (let j = 0; j < 12; j++) {
            newData[j][accountName] = accountStatisticsData.data[i].sumsPerMonth[newData[j]?.name]
        }
    }

    function stringToHash(str: string) {
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        if (hash < 0) return hash * -1;
        return hash;
    }

    return (
        <div className='bg-white rounded-lg p-1 shadow-md'>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={newData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {accountStatisticsData.data.map(dp => {
                        // create a unique color for each account line
                        const randomHexColor = Math.floor(stringToHash(dp.account.iban) * 1888438).toString(16).substring(0,6);
                        return (
                            <Line
                                type="monotone"
                                dataKey={dp.account.name.trim()}
                                stroke={`#${randomHexColor}`}  //"#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        )
                    })}
                </LineChart>
            </ResponsiveContainer>
            <MoniToolTip text='Set phone in landscape mode to see all the months!' icon={<LightbulbIcon />} />
        </div>
    );
}

export default MoniLineChart;
