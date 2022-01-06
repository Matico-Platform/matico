import { useEffect, useState } from "react";
import useSWR from "swr";
import { getProfile, login, signup } from "../utils/api";

export const useUser = () => {
  //@TODO import these from server types
  const [user, setUser] = useState<any | null>(null);
  const [signupError, setSignupError] = useState<any | null>(null);
  const [loginError, setLoginError] = useState<any | null>(null);

  const {data:profile, error:profileError, mutate} = useSWR(`http://localhost:8000/api/profile`, (url)=>fetch(url).then(r=>r.json()) ) 

  useEffect(() => {
    const interval = setInterval(()=>{
      getProfile()
        .then((profile) => {
          setUser(profile.data);
        })
        .catch((e) => {
          console.warn("token is invalid or stale", e);
        });
    },1000)
    return ()=> clearInterval(interval)
  }, []);

  const tryLogin = (email: string, password: string) => {
    login(email, password)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setUser(result.data.user);
        setLoginError(null);
      })
      .catch((e) => {
        setLoginError(e.response.data);
      });
  };

  const trySignup = (username: string, password: string, email: string) => {
    signup(username, password, email)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setUser(result.data.user);
        setSignupError(null);
      })
      .catch((e) => {
        setSignupError(e.response.data);
      });
  };

  const logout= () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return {
    user,
    signupError,
    loginError,
    login: tryLogin,
    signup: trySignup,
    logout,
  };
};
