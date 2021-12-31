import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { useJwt } from 'react-jwt';
import { login,  signup } from 'api';
import {LoginResponse, User} from 'types'

export function useLoginSignup() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tokenString, setTokenString] = useState<string | null>(
        null,
    );
    const { decodedToken, isExpired } = useJwt(
        tokenString ? tokenString : '',
    );

    console.log('Token is ', decodedToken);
    useEffect(() => {
        const ts = localStorage.getItem('token');
        if (ts) {
            setTokenString(ts);
        }
    }, []);

    const loggedIn = tokenString && !isExpired;

    const attemptLogin = async (email: string, password: string) => {
        setLoading(true);
        const reply = await login(email, password);
        setLoading(false);
        if (reply.status === 200) {
            const response = reply.data;
            localStorage.setItem('token', response.token);
            setTokenString(response.token);
        }
    };

    const attemptSignup = async (
        email: string,
        password: string,
        username: string,
    ) => {
        setLoading(true);
        const reply = await signup(username, password, email);
        if ((reply.status == 200)) {
            return reply.data;
        } else {
            throw Error('Signup failed');
        }
    };

    return { loggedIn, attemptLogin, attemptSignup, loading, error };
}
