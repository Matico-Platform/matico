import { useState, useEffect } from 'react';
import api from '../utils/api';

type UserProfile = {
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
};

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    // useEffect(()=>{
    //     console.log("setting up listening")
    //     window.addEventListener("storage", (e)=>{
    //         console.log(e)
    //         if(e.key==='token'){
    //             setToken(e.newValue)
    //         }
    //     })
    // },[])

    useEffect(() => {
        setLoading(true);
        api.get<UserProfile>('/users/profile')
            .then((response) => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(() => {
                console.log('Failed to get user');
            });
    }, [token]);

    return { profile, loading };
}
