import styled from 'styled-components';
import { Form } from 'Components/Forms/Forms';

const FeatureEditor = styled(Form)`
    overflow-y: auto;
    flex:1;
`
const FormEntry = styled.div`
    display:  grid;
    grid-template-columns:1fr 1fr ;
    align-items:center;
`;

const Buttons = styled.div`
    grid-column: 2;
    display:flex;
    flex-direction: row;
    justify-content:flex-end;
    button{
        margin-left:10px;
    }
`
export const Styles = {
    FormEntry,
    Buttons,
    FeatureEditor
};
