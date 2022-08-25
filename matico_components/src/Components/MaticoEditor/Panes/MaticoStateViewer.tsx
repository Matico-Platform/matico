import React from "react";
import { useMaticoSelector } from "Hooks/redux";
import { Flex, Heading, View, Text } from "@adobe/react-spectrum";
import { CollapsibleSection } from "../EditorComponents/CollapsibleSection";
import { IconForPaneType } from "../Utils/PaneDetails";
import { GeoFeatureVar, MapViewVar, RangeVar, VariableValue } from "index";

const GeoFeatureVariableViewer: React.FC<{ feature: GeoFeatureVar }> = ({
    feature
}) => {
    if (feature.value === "NoSelection") {
        return <Text>No Selection</Text>;
    }

    return (
        <Flex direction="column" gap={"size-200"}>
            {Object.entries(feature.value).map(
                ([name, value]: [name: string, value: any]) => (
                    <Flex
                        direction="row"
                        justifyContent="start"
                        gap={"size-200"}
                    >
                        {name === "geom" ? (
                            <Text>Geometry</Text>
                        ) : (
                            <>
                                <Text>{name}</Text>
                                <Text>{value}</Text>
                            </>
                        )}
                    </Flex>
                )
            )}
        </Flex>
    );
};

const RangeFeatureVariableViewer: React.FC<{ feature: RangeVar}> = ({
    feature
}) => {
    if (feature.value === "NoSelection") {
        return <Text>No Selection</Text>;
    }

    return (
        <Flex direction="column" gap={"size-200"}>
                    <Flex
                        direction="row"
                        justifyContent="start"
                        gap={"size-200"}
                    >
          <Text>Range</Text>
          <Text>{feature.value.min.toFixed(4)} - {feature.value.max.toFixed(4)}</Text>
          </Flex>
        </Flex>
    );
};


const MapViewFeatureVariableViewer: React.FC<{ feature: MapViewVar}> = ({
    feature
}) => {

    return (
        <Flex direction="column" gap={"size-200"}>
            {Object.entries(feature.value).map(
                ([name, value]: [name: string, value: any]) => (
                    <Flex
                        direction="row"
                        justifyContent="start"
                        gap={"size-200"}
                    >
                        {name === "geom" ? (
                            <Text>Geometry</Text>
                        ) : (
                            <>
                                <Text>{name}</Text>
                                <Text>{value}</Text>
                            </>
                        )}
                    </Flex>
                )
            )}
        </Flex>
    );
};

const ViewerForVariable: React.FC<{ variable: VariableValue }> = ({
    variable
}) => {
    switch (variable.type) {
        case "geofeature":
            return <GeoFeatureVariableViewer feature={variable} />;
        case "range":
            return <RangeFeatureVariableViewer feature={variable} />;
        case "mapview":
            return <MapViewFeatureVariableViewer feature={variable} />;
        default:
            return <Text>{JSON.stringify(variable.value)}</Text>;
    }
};

export const MaticoStateViewer: React.FC = () => {
    const state = useMaticoSelector((state) => state.variables);
    const panes = useMaticoSelector((state) => state.spec.spec.panes);

    const paneIds = Array.from(
        new Set(Object.values(state.autoVariables).map((v) => v.paneId))
    );

    return (
        <Flex direction="column">
            <Heading margin="size-150" alignSelf="start">
                Application State
            </Heading>
            <View paddingX="medium" paddingY="medium">
                {paneIds.map((paneId: string) => {
                    const pane = panes.find((p) => p.id === paneId);

                    return (
                        <View width='100%'>
                        <CollapsibleSection
                            title={pane?.name}
                            icon={IconForPaneType(pane?.type)}
                        >
                            {Object.values(state.autoVariables)
                                .filter((p) => p.paneId === paneId)
                                .map((variable) => (
                                    <CollapsibleSection title={variable.name}>
                                        <ViewerForVariable
                                            variable={variable.value}
                                        />
                                    </CollapsibleSection>
                                ))}
                        </CollapsibleSection>
                      </View>
                    );
                })}
            </View>
        </Flex>
    );
};
