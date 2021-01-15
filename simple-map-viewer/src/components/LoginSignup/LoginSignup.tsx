import React, {useState,useEffect} from 'react'
import {useLoginSignup} from '../../hooks/useLoginSignup'


type Props={

};

enum Panel{
    Login,
    Signup
}

export function LoginSignup(props:Props){
    const [pane, setPane] = useState<Panel>(Panel.Login)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const {attemptSignup,attemptLogin,loggedIn,error,loading} = useLoginSignup();

    const login = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        attemptLogin(email,password)
    }

    const signup =(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        attemptSignup(email,password,username)
    }
    
    return(
        <div className="login-siginup">
            <div className="tabs">
                <span onClick={()=>setPane(Panel.Login)}>Login</span>
                <span onClick={()=>setPane(Panel.Signup)}>Signup</span>
            </div>
            {pane==Panel.Login &&
                <div className="login">
                    <form onSubmit={login}>
                        <label>email</label>
                        <input value={email} onChange={(e)=>setEmail(e.target.value)} type='text' placeholder="email"/>
                        <label>password</label>
                        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password"/>
                        <button type='submit'>Login</button>
                    </form>
                </div>
            }
            {pane==Panel.Signup &&
                <div className="signup">
                    <form onSubmit={signup}>
                        <label>username</label>
                        <input value={username} onChange={e=>setUsername(e.target.value)} type='text' placeholder="username"/>
                        <label>email</label>
                        <input value={email} onChange={e=>setEmail(e.target.value)} type='text' placeholder="email"/>
                        <label>password</label>
                        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password"/>
                        <button type='submit'>Signup</button>
                    </form>
                </div>
            }
        </div>
    )
}