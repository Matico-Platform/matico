import styled from 'styled-components';

export const AppLayout = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-areas: 'nav main';
`;

export const FlexSeperator = styled.div`
 flex:1;
`

export const NavArea = styled.nav`
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.main};
    grid-area: nav;
`;

export const Page = styled.div`
    grid-area: main;
    display: flex;
    width:100%;
    height:100%;
    flex-direction: row;
`;
export const PageContent = styled.div`
    flex: 1;
    width:100%;
    height:100%;
`;

export const DetailsArea = styled.div`
    width: 300px;
    height: 100%;
    color: white;
    padding: 20px;
    display:flex;
    flex-direction:column;
    background-color: ${({ theme }) => theme.colors.secondary};
`;

export const MainArea = styled.div`
    padding: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Paper = styled.div`
       position:relative;
    -webkit-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
       -moz-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
            box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    padding:10px;
    border-radius:10px;
    background-color:white;

:before, :after
{
  content:"";
    position:absolute;
    z-index:-1;
    -webkit-box-shadow:0 0 20px rgba(0,0,0,0.8);
    -moz-box-shadow:0 0 20px rgba(0,0,0,0.8);
    box-shadow:0 0 20px rgba(0,0,0,0.8);
    top:10px;
    bottom:10px;
    left:0;
    right:0;
    -moz-border-radius:100px / 10px;
    border-radius:100px / 10px;
}
:after
{
  right:10px;
    left:auto;
    -webkit-transform:skew(8deg) rotate(3deg);
       -moz-transform:skew(8deg) rotate(3deg);
        -ms-transform:skew(8deg) rotate(3deg);
         -o-transform:skew(8deg) rotate(3deg);
            transform:skew(8deg) rotate(3deg);
}
`