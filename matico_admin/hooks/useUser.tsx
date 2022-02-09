import { useEffect, useState } from "react";
import { useSWRAPI, getProfile, login, signup } from "../utils/api";
import { mutate, useSWRConfig } from 'swr'


const profileUrl = '/users/profile'

export const useUser = () => {
  //@TODO import these from server types
  const [signupError, setSignupError] = useState<any | null>(null);
  const [loginError, setLoginError] = useState<any | null>(null);

  const {
    data: user,
    error: profileError,
  } = useSWRAPI(profileUrl, {refreshInterval:0});

  const { mutate } = useSWRConfig()
  const updateRoutes = ()=>{
        mutate(profileUrl)
        mutate('/datasets')
        mutate('/apps')

  }

  const tryLogin = (email: string, password: string) => {
    login(email, password)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setLoginError(null);
        updateRoutes()
      })
      .catch((e) => {
        setLoginError(e.response.data);
      });
  };

  const trySignup = (username: string, password: string, email: string) => {
    signup(username, password, email)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        updateRoutes()
      })
      .catch((e) => {
        setSignupError(e.response.data);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(()=>{
      updateRoutes();
    })
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
