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
    View
} from "@adobe/react-spectrum";
import React, {useMemo} from "react";

export interface DataTableProps {
    data: Array<Record<string, any>>;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    let table = useMemo(()=>{
      return (
                <TableView flex={1} overflowMode="truncate">
                    <TableHeader>
                        {Object.keys(data[0]).map((col) => (
                            <Column width={150} align="center">
                                <DialogTrigger isDismissable type="popover">
                                    <ActionButton margin="size-0" isQuiet>
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
                        {data.slice(0, 10).map((row: Array<any>) => (
                            <Row>
                                {Object.values(row).map((val: any) => (
                                    <Cell>
                                        <TooltipTrigger delay={0}>
                                            <Text>{val}</Text>
                                            <Tooltip>{val}</Tooltip>
                                        </TooltipTrigger>
                                    </Cell>
                                ))}
                            </Row>
                        ))}
                    </TableBody>
                </TableView>
      )}, [data])

    return (
        <View width="100%" height="100%">
            <Flex direction="column">
              {table}
            </Flex>
        </View>
    );
};
