import { Flex, ProgressCircle } from "@adobe/react-spectrum";
import React from "react";

export const LoadingSpinner: React.FC = () => {
    return (
        <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
        >
            <ProgressCircle
                aria-label="Loading…"
                isIndeterminate
                variant="overBackground"
            />
        </Flex>
    );
};
