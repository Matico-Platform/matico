import React from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'

interface PaginationProps {
    page:number,
    pages:number,
    onPageChange: (page:number)=>void  
}

const Wrapper = styled.div`
    ul{
        display: flex;
        justify-content: center;

        li{
            color:black;
            margin: 0px 5px;
            cursor: pointer;
        }
        .active-page{
            font-weight: 700
        }
    }
`

export const Pagination: React.FC<PaginationProps> = ({page,pages,onPageChange})=>{
    return(
        <Wrapper>        
            <ReactPaginate
                pageCount={pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={3}
                forcePage={page}
                onPageChange ={(page)=> onPageChange(page.selected)}
                activeClassName={"active-page"}
            />
        </Wrapper>
    )
}