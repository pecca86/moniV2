
// type Account {
//     id: number;
//     name: string;
//     balance: number;
// }

// type AccountArray {
//     accounts: Array<Account>;
// }

// export async function getAccounts() {
//     const response: Response = await fetch('http://localhost:3001/accounts');
//     const { data, error }: { data: AccountArray, error: any } = await response.json();

//     if (error) {
//         throw new Error(error.message)
//     }

//     return data.accounts;
// }



export async function getAccounts() {
    const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjQzNjMyNTksImV4cCI6MTcyNDk2ODA1OX0.W_LR4Z9Fsa-gvshadGAPPVr9_2GXgoyhr5V8n0WEi5A`
        }
    });
    const data = await response.json();

    console.log("Data: ", data);


    return data;
}