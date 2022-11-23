import {
    Flex,
    TableView,
    TableHeader,
    Column,
    DialogTrigger,
    ActionButton,
    Dialog,
    Heading,
    TableBody,
    Row,
    Cell,
    TooltipTrigger,
    Tooltip,
    Text,
    View,
    IllustratedMessage,
    Content
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import React, { useMemo } from "react";

export interface DataTableProps {
    data: Array<Record<string, any>>;
    rowLimit?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
    data,
    rowLimit = 10
}) => {
    let table = useMemo(() => {
        if (!data || data.length === 0) {
            return (
                <IllustratedMessage>
                    <NotFound />
                    <Heading>No data</Heading>
                    <Content>
                        The dataset or transform resulted in no data
                    </Content>
                </IllustratedMessage>
            );
        }
        return (
            <TableView flex={1} overflowMode="truncate">
                <TableHeader>
                    {Object.keys(data[0]).map((col: string, i: number) => (
                        <Column width={150} align="center" key={i}>
                            <DialogTrigger isDismissable type="popover">
                                <ActionButton
                                    margin="size-0"
                                    isQuiet
                                    aria-label={`See more information about ${col}`}
                                >
                                    {col}
                                </ActionButton>
                                <Dialog>
                                    <Heading>{col}</Heading>
                                </Dialog>
                            </DialogTrigger>
                        </Column>
                    ))}
                </TableHeader>
                <TableBody>
                    {data
                        .slice(0, rowLimit)
                        .map((row: Array<any>, i: number) => (
                            <Row key={`row${i}`}>
                                {Object.values(row).map(
                                    (val: any, j: number) => (
                                        <Cell key={`${j}${i}`}>
                                            <TooltipTrigger delay={0}>
                                                <Text>{val?.toString()}</Text>
                                                <Tooltip>
                                                    {val?.toString()}
                                                </Tooltip>
                                            </TooltipTrigger>
                                        </Cell>
                                    )
                                )}
                            </Row>
                        ))}
                </TableBody>
            </TableView>
        );
    }, [data, data?.length]);

    return (
        <View width="100%" height="100%">
            <Flex direction="column">{table}</Flex>
        </View>
    );
};
