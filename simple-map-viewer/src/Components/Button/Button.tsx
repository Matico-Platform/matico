import styled from 'styled-components'

export enum ButtonType{
    Primary = 'primary',
    Secondary = 'secondary',
    Dissabled = 'dissables'
}

interface ButtonProps{
    kind?: ButtonType,
    theme?: any
}

export const Button = styled.button<ButtonProps>`
    font-size:15px;
    padding: 10px 20px;
    font-weight:bold;
    color:white;
    cursor: pointer;
    border:none;
    background-color: ${({kind=ButtonType.Primary, theme} : ButtonProps)=>{
        switch(kind){
            case ButtonType.Primary:
                return theme.colors.main;
            case ButtonType.Secondary:
                return theme.colors.secondary;
            case ButtonType.Dissabled:
                return 'lightgrey'
        }
    }};

    :hover{
        background-color: ${({kind=ButtonType.Primary,  theme} : ButtonProps)=>{
            switch(kind){
                case ButtonType.Primary:
                    return theme.colors.mainLighter;
                case ButtonType.Secondary:
                    return theme.colors.secondary;
                case ButtonType.Dissabled:
                    return 'lightgrey'
            }
        }};
    }
`