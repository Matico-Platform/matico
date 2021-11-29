import React from 'react';
import { setCurrentEditPath } from "../../Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "../../Hooks/redux";
import styled from "styled-components";

const editTypeMapping = { // todo: centralize 
  "pages":"Page",
  "sections":"Section"
}

const BreadCrumbContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const BreadCrumbButton = styled.button`
  background-color: transparent;
  display: inline-block;
  width:auto;
  color:white;
  border:none;
  margin-right:0.125em;
  margin-bottom:0.25em;
  cursor:pointer;
  font-size:1rem;
  &:after {
    content: '  >'
  }
`

export const BreadCrumbs: React.FC<{ currentEditPath: string }> = ({ currentEditPath }) => {
    const dispatch = useMaticoDispatch();
    const breadCrumbPath = currentEditPath && currentEditPath.split(".");
    return <BreadCrumbContainer>
    {
      breadCrumbPath.slice(0,-2).map((editItem, index) => 
        index%2 === 0 && editTypeMapping[editItem] ? 
          <BreadCrumbButton 
            onClick={() => dispatch(setCurrentEditPath({editPath: breadCrumbPath.slice(0,index+2).join('.'), editType:editTypeMapping[editItem]}))}
            >
            {editTypeMapping[editItem]}
          </BreadCrumbButton>
        : null)
    }
    </BreadCrumbContainer>
}