import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Text,
    Heading,
    TableView,
    TableHeader,
    TableBody,
    Column,
    Row,
    Item,
    Cell,
    TooltipTrigger,
    Tooltip
} from "@adobe/react-spectrum";
import { DatasetSummary } from "Datasets/Dataset";
import { useRequestData } from "Hooks/useRequestData";
import React from "react";

import ActionsIcon from "@spectrum-icons/workflow/MoreSmallListVert";
import { useMaticoSelector } from "Hooks/redux";

interface DatasetModalProps {
    dataset: DatasetSummary;
}

export const DatasetModal: React.FC<DatasetModalProps> = ({
    children,
    dataset
}) => {
    const dataRequest = useRequestData(
        dataset.name,
        [],
        dataset.columns?.filter((c) => c.type !== "geometry").map((c) => c.name),
        10
    );


    console.log("Dataset is ", dataset, dataRequest);
    return (
        <DialogTrigger isDismissable>
            <ActionButton width="100%">{children}</ActionButton>
            <Dialog width="80vw">
                <Heading>{dataset.name}</Heading>
                <Content>
                    {dataset.error && <Text>{dataset.error}</Text>}
                    {dataRequest && dataRequest.state === "Done" && (
                        <TableView overflowMode="truncate">
                            <TableHeader>
                                {Object.keys(dataRequest.result[0]).map(
                                    (col) => (
                                        <Column width={150} align="center">
                                            <DialogTrigger
                                                isDismissable
                                                type="popover"
                                            >
                                                <ActionButton
                                                    margin="size-0"
                                                    isQuiet
                                                >
                                                    {col}
                                                </ActionButton>
                                                <Dialog>
                                                    <Heading>{col}</Heading>
                                                    <Content></Content>
                                                </Dialog>
                                            </DialogTrigger>
                                        </Column>
                                    )
                                )}
                            </TableHeader>
                            <TableBody>
                                {dataRequest.result
                                    .slice(0, 10)
                                    .map((row: Array<any>) => (
                                        <Row>
                                            {Object.values(row).map(
                                                (val: any) => (
                                                    <Cell>
                                                        <TooltipTrigger
                                                            delay={0}
                                                        >
                                                            <Text>{val}</Text>
                                                            <Tooltip>
                                                                {val}
                                                            </Tooltip>
                                                        </TooltipTrigger>
                                                    </Cell>
                                                )
                                            )}
                                        </Row>
                                    ))}
                            </TableBody>
                        </TableView>
                    )}
                </Content>
            </Dialog>
        </DialogTrigger>
    );
};
