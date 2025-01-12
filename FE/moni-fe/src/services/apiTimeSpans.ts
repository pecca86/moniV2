import toast from "react-hot-toast";

export async function getDateSpansForAccount(accountId: string | number | undefined, token: string | null) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/datespans/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: any = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching accounts');
    }
}


export async function createTimeSpan(data: any, token: string | null) {
    const payload = {
        from: data.from,
        to: data.to
    }

    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/datespans/${data.accountId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        toast.error('Error creating time span');
    }
}

export async function deleteTimeSpan(accountId: string | number | undefined, timeSpanId: string | number | undefined, token: string | null) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/datespans/${accountId}/${timeSpanId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        toast.error('Error deleting time span');
    }

}