import React, { useState, useEffect } from 'react';
import { useLoginSignup } from '../../Hooks/useLoginSignup';
import { Card } from '../Card/Card';
import { Tabs, Tab } from '../Tabs/Tabs';
import { Styles } from './LoginSignupStyles';
import { Form } from '../Forms/Forms';

type Props = {};

export function LoginSignup(props: Props) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const {
        attemptSignup,
        attemptLogin,
        loggedIn,
        error,
        loading,
    } = useLoginSignup();

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        attemptLogin(email, password);
    };

    const signup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        attemptSignup(email, password, username);
    };

    return (
        <Card>
            <Tabs>
                <Tab name="login">
                    <Form onSubmit={login}>
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
                        <button type="submit">Login</button>
                    </Form>
                </Tab>
                <Tab name="signup">
                    <Form onSubmit={signup}>
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
                        <button type="submit">Signup</button>
                    </Form>
                </Tab>
            </Tabs>
        </Card>
    );
}
