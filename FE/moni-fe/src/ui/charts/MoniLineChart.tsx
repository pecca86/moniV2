import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MoniToolTip from '../cta/MoniToolTip';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

let fakeManyAccountsData = {
    "data": [
        {
            "account": {
                "id": 4,
                "iban": "FI292332225319sreve",
                "balance": 200.00,
                "name": " SLAVERI",
                "savings_goal": 100.00,
                "account_type": "DEPOSIT",
                "balance_with_transactions": 24200.00
            },
            "sumsPerMonth": {
                "SEPTEMBER": 2000,
                "OCTOBER": 1000,
                "NOVEMBER": 2000,
                "DECEMBER": 3000,
                "JANUARY": 4000,
                "FEBRUARY": 2000,
                "MARCH": 1500,
                "APRIL": 1000,
                "MAY": 2000,
                "JUNE": 4000,
                "JULY": 3000,
                "AUGUST": -100
            }
        },
        {
            "account": {
                "id": 5,
                "iban": "FI292332225319sqk",
                "balance": 200.00,
                "name": " Account 44",
                "savings_goal": 100.00,
                "account_type": "DEPOSIT",
                "balance_with_transactions": 12188.00
            },
            "sumsPerMonth": {
                "SEPTEMBER": 9299,
                "OCTOBER": 999,
                "NOVEMBER": 999,
                "DECEMBER": 99,
                "JANUARY": 19,
                "FEBRUARY": -999,
                "MARCH": 949,
                "APRIL": 149,
                "MAY": 9929,
                "JUNE": 199,
                "JULY": 9499,
                "AUGUST": 199
            }
        }
    ]
}


const fakeAccountData = {
    "account": {
        "id": 4,
        "iban": "FI292332225319sreve",
        "balance": 200.00,
        "name": " Account 3",
        "savings_goal": 100.00,
        "account_type": "DEPOSIT",
        "balance_with_transactions": 24200.00
    },
    "sumsPerMonth": {
        "SEPTEMBER": 100,
        "OCTOBER": 2000,
        "NOVEMBER": 200,
        "DECEMBER": 1000,
        "JANUARY": 1200,
        "FEBRUARY": 2000,
        "MARCH": 3000,
        "APRIL": 4000,
        "MAY": 200,
        "JUNE": 24000,
        "JULY": 200,
        "AUGUST": 2000
    }
}

interface Props {
    accountStatisticsData: any[]
}

const MoniLineChart = ({accountStatisticsData}: Props) => {
    fakeManyAccountsData = accountStatisticsData // TODO: Clean this up!
    // fakeManyAccountsData = { data: [fakeAccountData] }
    const newData: any[] = []

    // Create an initial data point, cointaing just the months in the same order we receive them from the server
    let dataPoint = {}
    Object.keys(fakeManyAccountsData.data[0].sumsPerMonth).forEach(key => {
        dataPoint = {
            name: key,
        }
        newData.push(dataPoint)
    });

    for (let i = 0; i < fakeManyAccountsData.data.length; i++) {
        let accountName = fakeManyAccountsData.data[i].account.name.trim()
        for (let j = 0; j < 12; j++) {
            newData[j][accountName] = fakeManyAccountsData.data[i].sumsPerMonth[newData[j]?.name]
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
                    {fakeManyAccountsData.data.map(dp => {
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
