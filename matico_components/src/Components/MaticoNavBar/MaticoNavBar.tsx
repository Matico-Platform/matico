import { Avatar, Box, Text, Button, Nav, Sidebar } from "grommet";
import { Link } from "react-router-dom";
import { Page } from "matico_spec";
import React from "react";
import * as Icons from "grommet-icons";
import { useIsEditable } from "../../Hooks/useIsEditable";
import { useMaticoDispatch } from "../../Hooks/redux";
import { addPage, setCurrentEditPath } from "../../Stores/MaticoSpecSlice";
import { EditButton } from "../MaticoEditor/EditButton";

interface MaticoNavBarProps {
  pages: Array<Page>;
}

const NamedButton: React.FC<{ name: string; color?: string; size?: string }> =
  ({ name, color = "white", size = "normal" }) => {
    const NamedIcon = Icons[name] ? Icons[name] : Icons.Document;
    return <NamedIcon color={color} />;
  };

export const MaticoNavBar: React.FC<MaticoNavBarProps> = ({ pages }) => {
  const editable = useIsEditable();
  const dispatch = useMaticoDispatch();

  const onAddPage = () => {
    dispatch(
      addPage({
        //@ts-ignore
        page: {
          name: "new page",
          content: "This is a new page",
          icon: "Page",
          //@ts-ignore
          order: Math.max(...pages.map((p) => p.order)) + 1,
          sections: [],
        },
      })
    );
  };

  return (
    <Sidebar
      background="brand"
      round="small"
      header={
        <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
      }
      footer={<Button icon={<Icons.Help />} hoverIndicator />}
    >
      <Nav gap="small">
        {pages.map((page, index) => (
          <Link
            style={{ textDecoration: "none" }}
            key={page.name}
            to={page.path ? page.path : `/${page.name}`}
          >
            <Button
              badge={
                <EditButton editPath={`pages.${index}`} editType={"Page"} />
              }
              a11yTitle={page.name}
              icon={<NamedButton name={page.icon} />}
              hoverIndicator
            />
            <Text
              color="white"
              size={"small"}
              style={{ textDecoration: "none" }}
            >
              {page.name}
            </Text>
          </Link>
        ))}
        {editable && (
          <Button
            a11yTitle="Add page"
            icon={<NamedButton color={'accent-4'} name={"Add"} />}
            hoverIndicator
            onClick={() => onAddPage()}
          />
        )}
      </Nav>
    </Sidebar>
  );
};
