import React from 'react'
import {Page, Paper} from '../../Components/Layout/Layout'
import {LoginSignup} from '../../Components/LoginSignup/LoginSignup'
import {Styles} from './LoginSignupPageStyles'


interface LoginSignupPageProps{

}

export const LoginSignupPage: React.FC<LoginSignupPageProps> = ({})=>{

    return(
        <Page>
            <Styles.LoginSignupPage>
                <Paper>
                    <LoginSignup/>
                </Paper>
            </Styles.LoginSignupPage>
        </Page>
    )
}