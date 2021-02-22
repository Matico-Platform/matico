import React from 'react';
import { useUser } from '../../Contexts/UserContext';
import { Redirect } from 'react-router';
import { Button } from '../../Components/Button/Button';

export const ProfilePage: React.FC = () => {
    const { user, attempting_signin, signout } = useUser();

    if (!user && !attempting_signin) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <h1>Hi {user?.username}</h1>
            <Button onClick={signout}>Signout</Button>
        </div>
    );
};
