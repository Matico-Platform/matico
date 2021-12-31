import styled from 'styled-components'

const AddLayerModal =styled.div`
    padding:20px;
    position:fixed;
    top:50vh;
    left:50vw;
    transform:translate3d(-50%, -50%,0);
    background-color:white;
    z-index:10;
    border:1px solid black;
    label{
        color:grey;
    }
    span{
        color:grey;
    }
    button{ 
        margin-top:5px
    }
`

export const Styles={
    AddLayerModal
}