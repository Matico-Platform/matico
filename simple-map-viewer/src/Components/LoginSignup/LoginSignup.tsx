import React, { useState, useEffect } from 'react';
import {useUser} from '../../Contexts/UserContext'
import { Card } from '../Card/Card';
import {Redirect} from 'react-router'

import { Tabs, Tab } from '../Tabs/Tabs';
import {Button, ButtonType} from '../Button/Button'
import { Styles } from './LoginSignupStyles';
import { Form } from '../Forms/Forms';

type Props = {};

export function LoginSignup(props: Props) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const {
        user,
        errors,
        attempting_signin,
        attempting_signup,
        login,
        signup
    } = useUser();


    const tryLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(email, password);
    };

    const trySignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signup(email, password, username);
    };

    if(user){
        return <Redirect to ='/profile' />
    }

    return (
        <Card>
            <Tabs>
                <Tab name="login">
                    <Form onSubmit={tryLogin}>
                        <label>email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            placeholder="email"
                        />
                        <label>password</label>
                        <input
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            type="password"
                            placeholder="password"
                        />
                        <Button kind={ButtonType.Primary} type='submit'>Login</Button>
                    </Form>
                </Tab>
                <Tab name="signup">
                    <Form onSubmit={trySignup}>
                        <label>username</label>
                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            type="text"
                            placeholder="username"
                        />
                        <label>email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            placeholder="email"
                        />
                        <label>password</label>
                        <input
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            type="password"
                            placeholder="password"
                        />
                        <Button kind={ButtonType.Primary} type='submit'>Signup</Button>
                    </Form>
                </Tab>
            </Tabs>
        </Card>
    );
}
