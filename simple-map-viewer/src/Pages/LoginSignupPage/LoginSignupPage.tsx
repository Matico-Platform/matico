import React from 'react';
import { Page, Paper } from '../../Components/Layout/Layout';
import { LoginSignup } from '../../Components/LoginSignup/LoginSignup';
import { Styles } from './LoginSignupPageStyles';

export const LoginSignupPage: React.FC = () => {
    return (
        <Page>
            <Styles.LoginSignupPage>
                <Paper>
                    <LoginSignup />
                </Paper>
            </Styles.LoginSignupPage>
        </Page>
    );
};
