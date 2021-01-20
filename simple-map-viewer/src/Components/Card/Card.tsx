import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  /* color: grey; */
`;
