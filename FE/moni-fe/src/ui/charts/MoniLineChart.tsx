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

const fakeManyAccountsData = {
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
                "SEPTEMBER": 999,
                "OCTOBER": 999,
                "NOVEMBER": 999,
                "DECEMBER": 999,
                "JANUARY": 999,
                "FEBRUARY": 999,
                "MARCH": 999,
                "APRIL": 999,
                "MAY": 999,
                "JUNE": 999,
                "JULY": 999,
                "AUGUST": 999
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
    "data": {
        "SEPTEMBER": 2000,
        "OCTOBER": 2000,
        "NOVEMBER": 2000,
        "DECEMBER": 2000,
        "JANUARY": 2000,
        "FEBRUARY": 2000,
        "MARCH": 2000,
        "APRIL": 2000,
        "MAY": 2000,
        "JUNE": 2000,
        "JULY": 2000,
        "AUGUST": 2000
    }
}



const MoniLineChart = () => {



    const data: any[] = [
        {
            name: 'Jan',
            savings: 4000,
            deposit: 2400,
            cock: 4000,
            amt: 2400,
        },
        {
            name: 'Feb',
            savings: 3000,
            deposit: 1398,
            cock: 4000,
            amt: 2210,
        },
        {
            name: 'Mar',
            savings: 2000,
            deposit: 9800,
            cock: 4000,
            amt: 2290,
        },
        {
            name: 'Apr',
            savings: 2780,
            deposit: 3908,
            cock: 4000,
        },
        {
            name: 'May',
            savings: 1890,
            deposit: 4800,
            cock: 4000,
        },
        {
            name: 'Jun',
            savings: 2390,
            deposit: 3800,
            cock: 4000,
        },
        {
            name: 'Jul',
            savings: 3490,
            deposit: 4300,
            cock: 4000,
        },
        {
            name: 'Sept',
            savings: 3490,
            deposit: 4300,
            cock: 4000,
        },
        {
            name: 'Oct',
            savings: 3490,
            deposit: 4300,
            cock: 4000,
        },
        {
            name: 'Nov',
            savings: 3490,
            deposit: 4300,
            cock: 4000,
        },
        {
            name: 'Dec',
            savings: 3490,
            deposit: 4300,
            cock: 4000,
        },
    ];


    const newData: any[] = []

    // for (let i = 0; i < fakeManyAccountsData.data.length; i++) {
    let dd = {}
    Object.keys(fakeManyAccountsData.data[0].sumsPerMonth).forEach(key => {
        let accountName = fakeManyAccountsData.data[0].account.name.trim()
        
        dd = {
            name: key,
        }
        dd['name'] = key;
        dd[accountName] = fakeManyAccountsData.data[0].sumsPerMonth[key];
        newData.push(dd)
    });
    // }
    // console.log("DD ",dd);

    console.log("LEEEEEN", Object.keys(fakeManyAccountsData.data[0].sumsPerMonth).length)
    console.log("NEW DATA", newData)



    for (let i = 0; i < Object.keys(fakeManyAccountsData.data[0].sumsPerMonth).length; i++) {

        let m = newData[i].name;
        console.log("M IS ", m);
        // console.log("LISTING ALL MONTHS ",fakeManyAccountsData.data[i].sumsPerMonth[m])

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
    
                </LineChart>
            </ResponsiveContainer>
            <MoniToolTip text='Set phone in landscape mode to see all the months!' icon={<LightbulbIcon />} />
        </div>
    );
}

export default MoniLineChart;
