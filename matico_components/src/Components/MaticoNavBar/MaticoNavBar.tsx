import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { useIsEditable } from "../../Hooks/useIsEditable";
import { useApp } from "Hooks/useApp";
import { Button, ButtonGroup, Image, Text, View } from "@adobe/react-spectrum";
import { chromaColorFromColorSpecification } from "Components/Panes/MaticoMapPane/LayerUtils";

interface MaticoNavBarProps {}

const NamedButton: React.FC<{ name: string; color?: string; size?: string }> =
    ({ name, color = "white", size = "normal" }) => {
        // const iconName = flatIconList.includes(name) ? name : "file";
        return (
            <span
                className={name}
                style={{
                    display: "block",
                    fontSize: "150%",
                    padding: ".25em"
                }}
            />
        );
    };

const HoverLink = styled(Link)`
    text-decoration: none;
    padding: 0.5em 0;
    color: white;
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

export const MaticoNavBar: React.FC<MaticoNavBarProps> = () => {
    const editable = useIsEditable();
    const { pages, addPage, removePage, theme, setEditPage } = useApp();

    const logo = theme?.logoUrl;

    let color = chromaColorFromColorSpecification(theme.primaryColor, false);

    const onAddPage = () => {
        addPage({});
    };

    const setEditorPath = (pageId: string) => {
        if (editable) {
            setEditPage(pageId);
        }
    };

    return (
        <View
            overflow="hidden auto"
            height="100%"
            maxHeight="100vh"
            backgroundColor={"blue-600"}
            borderWidth="thin"
            borderColor="dark"
            UNSAFE_style={{
                textAlign: "center"
            }}
        >
            <ButtonGroup
                align="center"
                UNSAFE_style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                maxWidth="100%"
                marginTop="size-100"
            >
                <Link to="/" style={{ marginBottom: "1em" }}>
                    <Image
                        alt="Logo"
                        src={
                            logo ??
                            "https://www.matico.app/favicon/favicon-32x32.png"
                        }
                    />
                </Link>
                {pages.map((page, index) => (
                    <View
                        position="relative"
                        key={page.path}
                        width="100%"
                        marginY="size-150"
                    >
                        <HoverLink
                            to={page.path ? page.path : `/${page.name}`}
                            onClick={() => setEditorPath(page.id)}
                        >
                            <NamedButton name={page.icon} />
                            <Text>{page.name}</Text>
                        </HoverLink>
                    </View>
                ))}
                {editable && (
                    <Button
                        marginY="size-100"
                        marginX="size-100"
                        aria-label="Add page"
                        onPress={() => onAddPage()}
                        UNSAFE_style={{
                            fontSize: "0.75rem",
                            cursor: "pointer"
                        }}
                        isQuiet
                        variant="overBackground"
                    >
                        <NamedButton name="fas fa-plus" />
                    </Button>
                )}
            </ButtonGroup>
        </View>
    );
};
