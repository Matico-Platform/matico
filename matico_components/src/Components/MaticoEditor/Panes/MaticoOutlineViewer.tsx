import React from "react";
import { View } from "@adobe/react-spectrum";
import { useAppSpec } from "Hooks/useAppSpec";
import { RowEntryMultiButton, RowEntryMultiButtonProps } from "../Utils/RowEntryMultiButton";

const traversePages = (pages: any[]) => {
    // let mutableResult = [];
    let components: any[] = [];
    pages.forEach((page, pageIndex: number) => {
        const { name, sections }: {name: string, sections: []} = page;
        components.push(
            <RowEntryMultiButton
                entryName={name}
                editType={"page"}
                editPath={`pages.${pageIndex}`}
                compact={true}
                inset={0}
            />
        );
        // mutableResult.push({
        //     editType: "page",
        //     editPath: "pages." + pageIndex,
        //     name: name,
        //     children: []
        // });
        sections.forEach((section: {name:string, panes: any[], any: any}, sectionIndex: number) => {
            const { name, panes } = section;
            components.push(
                <RowEntryMultiButton
                    entryName={name}
                    editType={"section"}
                    editPath={`pages.${pageIndex}.sections.${sectionIndex}`}
                    inset={1}
                    compact={true}
                />
            );
            // mutableResult[pageIndex].children.push({
            //     editType: "section",
            //     editPath: "pages." + pageIndex + ".sections." + sectionIndex,
            //     name: name,
            //     children: []
            // });
            panes.forEach((pane, paneIndex) => {
                //@ts-ignore
                const [type, content]: [type: string, content: {name:string, any:any}] = Object.entries(pane)[0];

                const { name } = content;
                components.push(
                    <RowEntryMultiButton
                        entryName={name}
                        editType={type}
                        editPath={`pages.${pageIndex}.sections.${sectionIndex}.panes.${paneIndex}.${type}`}
                        inset={2}
                        compact={true}
                    />
                );
                // mutableResult[pageIndex].children[sectionIndex].children.push({
                //     editType: type,
                //     editPath:
                //         "pages." +
                //         pageIndex +
                //         ".sections." +
                //         sectionIndex +
                //         ".panes." +
                //         paneIndex +
                //         "." +
                //         type,
                //     name: name
                // });
            });
        });
    });
    return components;
};

export const MaticoOutlineViewer: React.FC = () => {
    const { pages } = useAppSpec();
    const rowComponents = traversePages(pages);
    // console.log('SPEC TRAVERSE', pages, traversePages(pages))
    return <View>{...rowComponents}</View>;
};
