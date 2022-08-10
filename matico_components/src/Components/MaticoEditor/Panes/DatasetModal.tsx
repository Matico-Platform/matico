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
    Cell,
    TooltipTrigger,
    Tooltip,
    View
} from "@adobe/react-spectrum";
import { DatasetSummary } from "Datasets/Dataset";
import { useRequestData } from "Hooks/useRequestData";
import React from "react";
import { ComputeParameterEditor } from "DatasetsProviders/ComputeProvider";
import { useDatasetActions } from "Hooks/useDatasetActions";
import {DataTable} from "../EditorComponents/DataTable/DataTable";

interface DatasetModalProps {
    dataset: DatasetSummary;
}

export const DatasetModal: React.FC<DatasetModalProps> = ({
    children,
    dataset
}) => {
    const dataRequest = useRequestData(
      {
        datasetName:dataset.name,
        filters: [],
        columns: dataset.columns
            ?.filter((c) => c.type !== "geometry")
            .map((c) => c.name),
            limit:10
      });

    const { updateDataset } = useDatasetActions(dataset.name);


    return (
        <DialogTrigger isDismissable>
            <ActionButton width="100%">{children}</ActionButton>

            <Dialog width="80vw">
                <Heading>{dataset.name}</Heading>
                <Content>
                    {dataset.error && <Text>{dataset.error}</Text>}
                    {dataRequest && dataRequest.state === "Done" && (
                        <Flex width={"100%"} gap={"size-200"} direction="row">
                            {dataset.spec?.type === "wasmCompute" && (
                                <View flex={1}>
                                    <h1>Compute!</h1>
                                    <ComputeParameterEditor
                                        onChange={(update: any) =>
                                            updateDataset(dataset.name, update)
                                        }
                                        spec={dataset.spec}
                                    />
                                </View>
                            )}
                            <DataTable data={dataRequest.result} />
                        </Flex>
                    )}
                </Content>
            </Dialog>
        </DialogTrigger>
    );
};
