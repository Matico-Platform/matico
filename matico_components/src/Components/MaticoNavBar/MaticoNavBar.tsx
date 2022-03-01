import { Avatar, Box, Button, Nav, Sidebar } from "grommet";
import { Link } from "react-router-dom";
import { Page } from "@maticoapp/matico_spec";
import React from "react";
import * as Icons from "grommet-icons";
import { useIsEditable } from "../../Hooks/useIsEditable";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { addPage, setCurrentEditPath } from "../../Stores/MaticoSpecSlice";
import { EditButton } from "Components/MaticoEditor/Utils/EditButton";
import chroma from "chroma-js";
import { Text } from "@adobe/react-spectrum";

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
  const theme = useMaticoSelector((state) => state.spec.spec.theme);
  const primaryColor = theme?.primaryColor;
  const logo = theme?.logoUrl;

  let chromaColor;
  if (Array.isArray(primaryColor)) {
    if (primaryColor.length === 4) {
      chromaColor = chroma.rgb([
        ...primaryColor.slice(0, 3),
        primaryColor[3] / 255,
      ]);
    } else if ((primaryColor.length = 3)) {
      chromaColor = chroma.rgb(primaryColor);
    }
  } else if (chroma.valid(primaryColor)) {
    chromaColor = chroma(primaryColor);
  }

  const onAddPage = () => {
    const firstPage = pages.length === 0;
    const pageNo = firstPage ? 0 : Math.max(...pages.map((p) => p.order)) + 1;

    dispatch(
      addPage({
        //@ts-ignore
        page: {
          name: firstPage ? "Home" : `Page${pageNo}`,
          content: `This page ${pageNo}`,
          path: firstPage ? "/" : `/page_${pageNo}`,
          icon: firstPage ? "Home" : "Page",
          //@ts-ignore
          order: pageNo,
          sections: [
            {
              name: "First Section",
              layout: "free",
              panes: [],
              order: 1,
            },
          ],
        },
      })
    );
  };

  return (
    <Sidebar
      background={chromaColor ? chromaColor.hex() : "neutral-2"}
      style={{textAlign:'center'}}
      header={
        <Avatar
          src={logo ?? "https://www.matico.app/favicon/favicon-32x32.png"}
          elevation="small"
          style={{ margin: "0 auto" }}
        />
      }
      elevation="medium"
      footer={<Button icon={<Icons.Help />} hoverIndicator />}
    >
      <Nav gap="small" >
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
            <Text>
              {page.name}
            </Text>
          </Link>
        ))}
        {editable && (
          <Button
            a11yTitle="Add page"
            icon={<NamedButton color={"accent-4"} name={"Add"} />}
            hoverIndicator
            onClick={() => onAddPage()}
          />
        )}
      </Nav>
    </Sidebar>
  );
};
