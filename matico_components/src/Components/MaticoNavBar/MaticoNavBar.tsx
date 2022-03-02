import { Link } from "react-router-dom";
import { Page } from "@maticoapp/matico_spec";
import React from "react";
import styled from "styled-components";
import * as Icons from "grommet-icons";
import { useIsEditable } from "../../Hooks/useIsEditable";
import { useMaticoDispatch, useMaticoSelector } from "../../Hooks/redux";
import { addPage, setCurrentEditPath } from "../../Stores/MaticoSpecSlice";
import { ControlButton } from "Components/MaticoEditor/Utils/MaticoControlButton";
import chroma from "chroma-js";
import { Button, ButtonGroup, Image, Text, View } from "@adobe/react-spectrum";

interface MaticoNavBarProps {
  pages: Array<Page>;
}

const NamedButton: React.FC<{ name: string; color?: string; size?: string }> =
  ({ name, color = "white", size = "normal" }) => {
    const NamedIcon = Icons[name] ? Icons[name] : Icons.Document;
    return <NamedIcon color={color} />;
};

const HoverLink = styled(Link)`
  text-decoration: none;
  padding:.5em 0;
  &:hover {
    background:rgba(255,255,255,0.1);
  }
`

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
    <View 
      overflowX="hidden"
      overflowY="auto"
      height="100%"
      backgroundColor={chromaColor ? "" : "indigo-400"}
      borderWidth="thin"
      borderColor="dark"
      UNSAFE_style={{
        backgroundColor: chromaColor ? chromaColor.hex() : "inherit"
      }}>
      <ButtonGroup align="center" maxWidth="100%" marginTop="size-100">
        <Link to="/" style={{marginBottom: '1em'}}>
          <Image
            src={logo ?? "https://www.matico.app/favicon/favicon-32x32.png"}
            />
        </Link>
        {pages.map((page, index) => (
          <View position="relative" key={page.path} width="100%" marginY="size-150">
            <HoverLink
              to={page.path ? page.path : `/${page.name}`}
            >
              <NamedButton name={page.icon} />
              <Text>
                {page.name}
              </Text>
            </HoverLink>
            <View position="absolute" right="-20px" top="-20px">
              <ControlButton action="edit" editPath={`pages.${index}`} editType={"Page"} />
            </View>
          </View>
        ))}
        {editable && (
          <Button
            marginY="size-100"
            marginX="size-100"
            aria-label="Add page"
            onPress={() => onAddPage()}
            UNSAFE_style={{fontSize: '0.75rem', cursor: 'pointer'}}
            isQuiet
            variant="overBackground"
            
          >
            <NamedButton name="Add" />
          </Button>
        )}
      </ButtonGroup>
    </View>
    // <Sidebar
    //   background={chromaColor ? chromaColor.hex() : "neutral-2"}
    //   style={{textAlign:'center'}}
    //   header={
    //     <Avatar
    //       src={logo ?? "https://www.matico.app/favicon/favicon-32x32.png"}
    //       elevation="small"
    //       style={{ margin: "0 auto" }}
    //     />
    //   }
    //   elevation="medium"
    //   footer={<Button icon={<Icons.Help />} hoverIndicator />}
    // >
    //   <Nav gap="small" >
    //   </Nav>
    // </Sidebar>
  );
};
