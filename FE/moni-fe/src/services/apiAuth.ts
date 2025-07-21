import { RegistrationData, User } from "../types/global";
import toast from "react-hot-toast";

export async function login(user: User): Promise<any> {
    try {
        const response: Response = await fetch(`/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        
        return await response.json();
    } catch (error) {
        throw new Error('Failed to login!');
    }
}

export async function register(registrationData: RegistrationData) {
    try {
        const payload = {
            email: registrationData.email,
            firstName: registrationData.firstname,
            lastName: registrationData.lastname,
            password: registrationData.password
        }
        const response: Response = await fetch(`/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (err) {
        toast.error('Error registering user');
    }

}

export async function getUserDetails(token: string) {
    try {
        const response: Response = await fetch(`/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        const userData = await response.json();
        return userData;
    } catch (error) {
        toast.error('Error fetching user details');
    }
}

export async function changePassword(password: string, token: string) {
    try {
        const response: Response = await fetch(`/api/v1/auth/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ password })
        });

        return await response.json();
    } catch (error) {
        toast.error('Error changing password');
    }
}