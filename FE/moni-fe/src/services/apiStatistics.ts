
export async function getAllAccountsAndTransactionsStatistics(token: string | null): Promise<any> {
    try {
        const response: Response = await fetch(`/api/v1/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return  await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getAccountTransactionStatistics(accountId: string, token: string | null) {
    try {
        const response: Response = await fetch(`/api/v1/statistics/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: any = await response.json();

        return { data: [data]};
        // return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getAccountCategoryStatistics(accountId: string, token: string | null): Promise<any> {
    try {
        const response: Response = await fetch(`/api/v1/statistics/${accountId}/category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}