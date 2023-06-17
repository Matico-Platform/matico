import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    View,
    Text,
    StatusLight
} from "@adobe/react-spectrum";
import { useDatasetTransform } from "Hooks/useDatasetTransform";
import React from "react";
import Delete from "@spectrum-icons/workflow/Delete";
import { DatasetTransformEditorProps } from "./types";
import { DatasetStatusColors } from "Components/DatasetEditor/DatasetsEditor";
import { DatasetTransformEditor } from "./DatasetTransformEditor";

export const DatasetTransformDialog: React.FC<DatasetTransformEditorProps> = ({
    transformId,
    state
}) => {
    const { datasetTransform, removeTransform } =
        useDatasetTransform(transformId);
    return (
        <View
            borderBottomColor={"gray-300"}
            borderBottomWidth="thin"
            padding={0}
            margin={0}
        >
            <Flex direction="row" width="100%">
                <DialogTrigger isDismissable>
                    <ActionButton isQuiet flexGrow={1}>
                        <Flex
                            direction="row"
                            gap="small"
                            width="100%"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Text>{datasetTransform.name} </Text>
                            <StatusLight variant={DatasetStatusColors[state]} />
                        </Flex>
                    </ActionButton>
                    {(close) => (
                        <Dialog width="90vw" height="90vh">
                            <Content>
                                <DatasetTransformEditor
                                    state={state}
                                    transformId={transformId}
                                />
                            </Content>
                        </Dialog>
                    )}
                </DialogTrigger>
                <ActionButton isQuiet onPress={removeTransform}>
                    <Delete />
                </ActionButton>
            </Flex>
        </View>
    );
};
