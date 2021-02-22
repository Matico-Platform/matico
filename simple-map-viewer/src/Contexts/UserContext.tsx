import React, {
    createContext,
    useReducer,
    useEffect,
    useContext,
} from 'react';
import { User, getProfile, login, signup } from '../api';

enum ActionType {
    ATTEMPT_LOGIN,
    SIGNED_OUT,
    SIGNED_IN,
    ATTEMPT_SIGNUP,
    SIGNUP_SUCCESSFUL,
    UPDATE_USER,
    SIGNUP_FAILED,
}

type ATTEMPT_LOGIN = {
    type: ActionType.ATTEMPT_LOGIN;
};

type ATTEMPT_SIGNUP = {
    type: ActionType.ATTEMPT_SIGNUP;
};

type SIGNED_OUT = {
    type: ActionType.SIGNED_OUT;
};

type SIGNED_IN = {
    type: ActionType.SIGNED_IN;
};

type SIGNUP_SUCCESSFUL = {
    type: ActionType.SIGNUP_SUCCESSFUL;
    payload: User;
};

type UPDATE_USER = {
    type: ActionType.UPDATE_USER;
    payload: User;
};

type SIGNUP_FAILED = {
    type: ActionType.SIGNUP_FAILED;
    payload: string;
};

type UserAction =
    | ATTEMPT_LOGIN
    | ATTEMPT_SIGNUP
    | SIGNED_OUT
    | SIGNED_IN
    | SIGNUP_SUCCESSFUL
    | SIGNUP_FAILED
    | UPDATE_USER;

interface UserState {
    user: User | null;
    errors: string[];
    attempting_signin: boolean;
    attempting_signup: boolean;
}

const InitalUserState: UserState = {
    user: null,
    errors: [],
    attempting_signin: false,
    attempting_signup: false,
};

const UserContext = createContext<{
    state: UserState;
    dispatch: React.Dispatch<UserAction>;
}>({
    state: InitalUserState,
    dispatch: () => null,
});

function reducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case ActionType.UPDATE_USER:
            return { ...state, user: action.payload };
        case ActionType.SIGNED_IN:
            return { ...state, attempting_signin: false };
        case ActionType.ATTEMPT_SIGNUP:
            return { ...state, attempting_signup: true };
        case ActionType.SIGNUP_FAILED:
            return {
                ...state,
                attempting_signup: false,
                errors: [action.payload],
            };
        case ActionType.SIGNED_OUT:
            return { ...state, user: null };
        case ActionType.SIGNUP_SUCCESSFUL:
            return {
                ...state,
                user: action.payload,
                errors: [],
                attempting_signup: false,
            };
        default:
            return state;
    }
}

export const useUser = () => {
    const { state, dispatch } = useContext(UserContext);

    const tryLogin = (email: string, password: string) => {
        login(email, password).then((result) => {
            localStorage.setItem('token', result.data.token);
            dispatch({
                type: ActionType.UPDATE_USER,
                payload: result.data.user,
            });
        });
    };

    const trySignup = (
        username: string,
        password: string,
        email: string,
    ) => {
        dispatch({
            type: ActionType.ATTEMPT_SIGNUP,
        });

        signup(username, password, email)
            .then((result) => {
                localStorage.setItem('token', result.data.token);
                dispatch({
                    type: ActionType.SIGNUP_SUCCESSFUL,
                    payload: result.data.user,
                });
            })
            .catch((e) => {
                dispatch({
                    type: ActionType.SIGNUP_FAILED,
                    payload: e.toString(),
                });
            });
    };

    const signout = () => {
        localStorage.removeItem('token');
        dispatch({
            type: ActionType.SIGNED_OUT,
        });
    };

    return { ...state, login: tryLogin, signup: trySignup, signout };
};

export const UserProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, InitalUserState);

    useEffect(() => {
        getProfile()
            .then((profile) => {
                dispatch({
                    type: ActionType.SIGNED_IN,
                });
                dispatch({
                    type: ActionType.UPDATE_USER,
                    payload: profile.data,
                });
            })
            .catch((e) => {
                console.warn('token is invalid or stale', e);
            });
    }, []);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
