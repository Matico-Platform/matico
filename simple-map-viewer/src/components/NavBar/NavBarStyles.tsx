import styled from 'styled-components'

const NavBarOuter = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    a{
        color:white;
    }
    padding:30px 10px;
`

const NavBarButton = styled.div`
    color: white;
    font-size:20px;
    text-align:center;
    flex-direction:column;
    align-items:center;
    margin-bottom:20px;
`

const NavBarSpacer = styled.div`
    flex:1;
`

export const Styles={
    NavBarOuter,
    NavBarButton,
    NavBarSpacer
}
