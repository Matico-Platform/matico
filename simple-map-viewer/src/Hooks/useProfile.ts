import {useState, useEffect} from 'react'
import api from '../api'

type UserProfile={
    username:string,
    email:string,
    created_at: Date,
    updated_at: Date
}

export function useProfile(){
    const [profile,setProfile] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        console.log("setting up listening")
        window.addEventListener("storage", (e)=>{
            console.log(e)
            if(e.key==='token'){
                setToken(e.newValue)
            }
        })
    },[])

    useEffect( ()=>{
        api.get<UserProfile>("/users/profile")
           .then((response)=> setProfile(response.data))
    },[token])    

    return profile 

}