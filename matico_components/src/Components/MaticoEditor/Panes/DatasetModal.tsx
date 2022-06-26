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
    Tooltip,
    View
} from "@adobe/react-spectrum";
import { DatasetSummary } from "Datasets/Dataset";
import { useRequestData } from "Hooks/useRequestData";
import React from "react";
import { ComputeParameterEditor } from "DatasetsProviders/ComputeProvider";
import {useDatasetActions} from "Hooks/useDatasetActions";

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
        dataset.columns
            ?.filter((c) => c.type !== "geometry")
            .map((c) => c.name),
        10
    );

    const {updateDataset} = useDatasetActions(dataset.name)

    console.log("Dataset is ", dataset)
    

    return (
        <DialogTrigger isDismissable>
            <ActionButton width="100%">{children}</ActionButton>

            <Dialog width="80vw">
                <Heading>{dataset.name}</Heading>
                <Content>
                    {dataset.error && <Text>{dataset.error}</Text>}
                    {dataRequest && dataRequest.state === "Done" && (
                        <Flex width={"100%"} gap={"size-200"} direction="row">
                            {dataset.spec?.type === "WASMCompute" && (
                                <View flex={1}>
                                    <h1>Compute!</h1>
                                    <ComputeParameterEditor
                                        onChange={(update: any) =>
                                          updateDataset(dataset.name, update )
                                        }
                                        spec = {dataset.spec}
                                    />
                                </View>
                            )}
                            <TableView flex={1} overflowMode="truncate">
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
                                                                <Text>
                                                                    {val}
                                                                </Text>
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
                        </Flex>
                    )}
                </Content>
            </Dialog>
        </DialogTrigger>
    );
};
