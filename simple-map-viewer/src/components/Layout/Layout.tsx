import styled from 'styled-components';

export const AppLayout = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: grid;
  grid-template-columns: 60px 300px 1fr;
  grid-template-areas: 'nav details main';
`;

export const NavArea = styled.nav`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.main};
`;

export const DetailsArea = styled.div`
  width: 300px;
  height: 100%;
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
