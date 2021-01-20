import {useState,useEffect} from 'react'
import {useJwt} from 'react-jwt'

export type User ={
    username: string,
    password: string,
    email: string
}

export type LoginResponse={
    user: User,
    token:string
}

export function useLoginSignup(){
    const [error, setError] = useState<string|null>(null)
    const [loading, setLoading] = useState(false)
    const [tokenString, setTokenString] = useState<string| null>(null)
    const {decodedToken, isExpired} = useJwt(tokenString ? tokenString : '');

    console.log("Token is ",decodedToken)
    useEffect(()=>{
        const ts = localStorage.getItem('token');
        if(ts){
            setTokenString(ts)
        }
    },[])

    const loggedIn = tokenString && !isExpired;

    const attemptLogin = async (email:String,password:String)=>{
        setLoading(true)
        let result = await fetch(`${process.env.REACT_APP_SERVER}auth/login`,{
            method:"POST",
            body:JSON.stringify({
                email,
                password
            }),
            headers:{
                'Content-Type': 'application/json'
            },
        })
        setLoading(false);
        if(result.status===200){
            let response: LoginResponse = await result.json()
            localStorage.setItem("token",response.token)
            setTokenString(response.token)
        }
    };

    const attemptSignup = async (email:string,password:string,username: string)=>{
        setLoading(true);
        const result = await fetch(`${process.env.REACT_APP_SERVER}auth/signup`,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                username,
                password,
                email
            })
        })
    }

    return {loggedIn,attemptLogin, attemptSignup, loading,error}
}