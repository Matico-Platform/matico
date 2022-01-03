import { useEffect, useState } from "react";
import { getProfile, login, signup } from "../utils/api";

export const useUser = () => {
  //@TODO import these from server types
  const [user, setUser] = useState<any | null>(null);
  const [signupError, setSignupError] = useState<any | null>(null);
  const [loginError, setLoginError] = useState<any | null>(null);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setUser(profile.data);
      })
      .catch((e) => {
        console.warn("token is invalid or stale", e);
      });
  }, []);

  const tryLogin = (email: string, password: string) => {
    login(email, password)
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setUser(result.data.user);
        setLoginError(null);
      })
      .catch((e) => {
        setLoginError(e.toString());
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
        setSignupError(e.toString());
      });
  };

  const signout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, signupError, loginError,login: tryLogin, signup: trySignup, signout };
};
