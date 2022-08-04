import {DialogTrigger, ActionButton, Flex, Divider, TextField, ButtonGroup, View, Text} from '@adobe/react-spectrum';
import {ParentSize} from '@visx/responsive';
import {DatasetSelector} from 'Components/MaticoEditor/Utils/DatasetSelector';
import React, {useState} from 'react'

export interface AddLayerModalProps {
    onAddLayer: (name: string, dataset: string) => void;
}
export const AddLayerModal: React.FC<AddLayerModalProps> = ({ onAddLayer }) => {
    const [dataset, setDataset] = useState<string | null>(null);
    const [layerName, setLayerName] = useState<string>("New layer name");

    return (
        <ParentSize>
            {({ width }) => {
                return (
                    <DialogTrigger
                        isDismissable
                        type="popover"
                        containerPadding={0}
                        hideArrow
                    >
                        <ActionButton width="100%">Add Map Layer</ActionButton>
                        {(close) => (
                            <View
                                width={width}
                                backgroundColor="gray-75"
                                borderColor="informative"
                                borderWidth="thick"
                                UNSAFE_style={{
                                    boxShadow: "0px 0px 8px 4px rgba(0,0,0,0.5)"
                                }}
                            >
                                <Flex direction="column" margin="size-150">
                                    <Text>Add layer</Text>
                                    <Divider size="M" />
                                    <TextField
                                        width="100%"
                                        label="Layer name"
                                        labelPosition="side"
                                        value={layerName}
                                        onChange={setLayerName}
                                        marginY="size-50"
                                    />
                                    <DatasetSelector
                                        selectedDataset={dataset}
                                        onDatasetSelected={setDataset}
                                    />
                                    <ButtonGroup>
                                        <ActionButton
                                            type="submit"
                                            width="100%"
                                            marginY="size-50"
                                            onPress={() => {
                                                onAddLayer(dataset, layerName);
                                                close();
                                            }}
                                        >
                                            Add to Map
                                        </ActionButton>
                                    </ButtonGroup>
                                </Flex>
                            </View>
                        )}
                    </DialogTrigger>
                );
            }}
        </ParentSize>
    );
};
