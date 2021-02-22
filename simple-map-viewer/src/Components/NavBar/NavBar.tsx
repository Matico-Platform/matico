import React from 'react';
import { Styles } from './NavBarStyles';

export const NavBar: React.FC = ({ children }) => {
    return <Styles.NavBarOuter>{children}</Styles.NavBarOuter>;
};

export const NavBarButton = Styles.NavBarButton;
export const NavBarSpacer = Styles.NavBarSpacer;
