import React from "react";
import { Page, Layout } from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import {usePage} from "Hooks/usePage";

interface MaticoPageInterface {
    pageId: string;
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({ pageId }) => {
    let {page} = usePage(pageId)
    let layout: Layout = page?.layout;
    let LayoutEngine = selectLayout(layout);

    return (
        <View overflow="none auto" width="100%" height="100%" id="xxx">
            <Flex direction="column" width={"100%"} height={"100%"}>
                <LayoutEngine paneRefs={page?.panes} />
            </Flex>
        </View>
    );
};
