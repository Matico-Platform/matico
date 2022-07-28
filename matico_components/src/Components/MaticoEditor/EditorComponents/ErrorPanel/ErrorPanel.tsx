import {
    ActionButton,
    Content,
    Flex,
    Heading,
    Item,
    ListBox,
    Text
} from "@adobe/react-spectrum";
import { useErrors } from "Hooks/useErrors";
import React from "react";

interface ErrorPanelProps {}

export const ErrorPanel: React.FC<ErrorPanelProps> = () => {
    const { errors } = useErrors();
    return (
        <Flex height={"100%"} direction="column">
            <Heading margin="size-150" alignSelf="start">
                Errors
            </Heading>
            {errors.length > 0 ? (
                <Flex direction="column" flex={1} paddingRight="20px">
                    {errors.map((error) => (
                        <ActionButton key={error.id}>
                          <Content>{error.message}</Content>
                        </ActionButton>
                    ))}
                </Flex>
            ) : (
                <Flex
                    direction="column"
                    flex={1}
                    height={"100%"}
                    justifyContent={"center"}
                >
                    <Text>No errors!</Text>
                    <Text>Everything looks peachy!</Text>
                    <Text>Good job you!</Text>
                </Flex>
            )}
        </Flex>
    );
};
