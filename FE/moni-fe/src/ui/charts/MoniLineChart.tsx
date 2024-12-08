import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MoniToolTip from '../cta/MoniToolTip';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { AccountsStatisticData } from '../../types/global';
import { useState } from 'react';
import MoniBanner from '../banners/MoniBanner';

interface Props {
    accountStatisticsData: AccountsStatisticData
}

type DataPoint = {
        name: string,
        [key: string]: number | string,
}
type LineChartData = DataPoint[];

const MoniLineChart = ({ accountStatisticsData }: Props) => {
    const [hiddenNameList, setHiddenNameList] = useState<string[]>([]);

    if (!accountStatisticsData || accountStatisticsData?.data.length === 0) {
        return (
            <div className='flex justify-center items-center'>
                <MoniBanner style='info'>No transaction statistics available...</MoniBanner>
            </div>
        )
    }
    const chartData: LineChartData = []

    // Create an initial data point, cointaing just the months in the same order we receive them from the server
    let dataPoint: DataPoint = { name: '' }
    Object.keys(accountStatisticsData.data[0].sumsPerMonth).forEach(key => {
        dataPoint = {
            name: key,
        }
        chartData.push(dataPoint)
    });


    for (let i = 0; i < accountStatisticsData.data.length; i++) {
        let accumulatingSum: number = 0;
        let accountName = accountStatisticsData.data[i].account.name.trim()
        for (let j = 0; j < 12; j++) {
            accumulatingSum += accountStatisticsData.data[i].sumsPerMonth[chartData[j]?.name]
            chartData[j][accountName] = accumulatingSum;
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

    function handleHideLine(e : any) {
        let legend: string = e.dataKey
        if (hiddenNameList.includes(legend)) {
            setHiddenNameList((hiddenNameList) => hiddenNameList.filter(item => item !== e.dataKey));
        } else {
            setHiddenNameList([...hiddenNameList, e.dataKey]);
        }
    }

    // shorten the month name from eg. SEPTEMBER to SEP
    chartData.map(dataPoint => {
        dataPoint.name = dataPoint?.name.substring(0, 3);
        return dataPoint
    })

    return (
        <div className='bg-white rounded-lg p-1 shadow-md'>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend onClick={(e) => handleHideLine(e)} />
                    {accountStatisticsData.data.map(dp => {
                        // create a unique color for each account line
                        const randomHexColor = Math.floor(stringToHash(dp.account.iban) * 1888438).toString(16).substring(0, 6);
                        return (
                            <Line
                                id='KUUK'
                                type="monotone"
                                dataKey={dp.account.name.trim()}
                                stroke={`#${randomHexColor}`}  //"#8884d8"
                                activeDot={{ r: 8 }}
                                hide={hiddenNameList.includes(dp.account.name.trim())}
                            />
                        )
                    })}
                </LineChart>
            </ResponsiveContainer>
            <MoniToolTip text='You can click on the account name to show / hide the corresponding line!' icon={<LightbulbIcon />} />
        </div>
    );
}

export default MoniLineChart;
