import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MoniToolTip from '../cta/MoniToolTip';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface Account {
    id: number;
    iban: string;
    balance: number;
    name: string;
    savings_goal: number;
    account_type: string;
    balance_with_transactions: number;
}

interface SumsPerMonth {
    SEPTEMBER: number;
    OCTOBER: number;
    NOVEMBER: number;
    DECEMBER: number;
    JANUARY: number;
    FEBRUARY: number;
    MARCH: number;
    APRIL: number;
    MAY: number;
    JUNE: number;
    JULY: number;
    AUGUST: number;
}

interface AccountData {
    account: Account;
    sumsPerMonth: SumsPerMonth;
}

interface FakeManyAccountsData {
    data: AccountData[];
}

let fakeManyAccountsData = {
    "data": [
        {
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



const MoniLineChart = () => {

    fakeManyAccountsData = { data: [fakeAccountData]}
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

    return (
        <div className='bg-white rounded-lg p-1 shadow-md'>
            <p>
                <label htmlFor="with-balance">With balance</label>
                <input type="checkbox" name="with-balance" id="" />
            </p>
            {/* <ResponsiveContainer width={340} height={300}> */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={newData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={fakeManyAccountsData.data[0].account.name.trim()}
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Account 44"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />

                </LineChart>
            </ResponsiveContainer>
            <MoniToolTip text='Set phone in landscape mode to see all the months!' icon={<LightbulbIcon />} />
        </div>
    );
}

export default MoniLineChart;
