import React from "react";
import { Page, Layout } from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";

interface MaticoPageInterface {
    page: Page;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({ page }) => {
    let layout: Layout = page.layout;
    let LayoutEngine = selectLayout(layout);

    return (
        <View overflow="none auto" width="100%" height="100%">
            <Flex direction="column" width={"100%"} height={"100%"}>
                <LayoutEngine paneRefs={page.panes} />
            </Flex>
        </View>
    );
};
