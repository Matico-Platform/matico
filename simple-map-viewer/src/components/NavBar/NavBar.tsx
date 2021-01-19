import React from 'react';
import {Styles} from './NavBarStyles';


type Props ={

}

export const NavBar: React.FC<Props> = ({children})=>{
    return(
        <Styles.NavBarOuter>
            {children}

        </Styles.NavBarOuter>
    )
}

export const NavBarButton = Styles.NavBarButton;
export const NavBarSpacer= Styles.NavBarSpacer;
