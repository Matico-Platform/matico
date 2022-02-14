import React, { Key } from "react";
import { setCurrentEditPath } from "Stores/MaticoSpecSlice";
import { useMaticoDispatch } from "Hooks/redux";
import styled from "styled-components";
import { Breadcrumbs, Item } from "@adobe/react-spectrum";

const editTypeMapping = {
  // todo: centralize
  pages: "Page",
  sections: "Section",
};

const BreadCrumbContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const BreadCrumbButton = styled.button`
  background-color: transparent;
  display: inline-block;
  width: auto;
  color: white;
  border: none;
  margin-right: 0.125em;
  margin-bottom: 0.25em;
  cursor: pointer;
  font-size: 1rem;
  &:after {
    content: "  >";
  }
`;

export const BreadCrumbs: React.FC<{ editPath: string }> = ({ editPath }) => {
  const dispatch = useMaticoDispatch();

  if (!editPath) {
    return <></>;
  }

  const breadCrumbPath = editPath.split(".");

  const setEditPath = () => {};

  console.log("breadCrumbPath ", breadCrumbPath);

  const pathSegments = breadCrumbPath
    .slice(0, -2)
    .map((editItem, index) => ({
      label: editTypeMapping[editItem],
      editPath: breadCrumbPath.slice(0, index + 1).join("."),
      editType: editTypeMapping[editItem],
    }))
    .filter((a) => a.label);

  if (pathSegments.length === 0) {
    return <></>;
  }

  console.log("path segments ", pathSegments);

  return (
    <Breadcrumbs
      onAction={(selectedId: Key) => console.log("selected ", selectedId)}
    >
      {pathSegments.map((item: any) => (
        <Item key={editPath}>{item.label}</Item>
      ))}
    </Breadcrumbs>
  );
};
