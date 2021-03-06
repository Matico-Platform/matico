import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { MaticoRangeControl } from "./MaticoRangeControl";
import { MaticoSelectControl } from "./MaticoSelectControl";
import { useNormalizeSpec } from "../../../Hooks/useNormalizeSpec";
import {
    View,
    Flex,
    Heading,
    Provider,
    lightTheme
} from "@adobe/react-spectrum";
import { Control } from "@maticoapp/matico_types/spec";

export interface MaticoControlsPaneInterface extends MaticoPaneInterface {
    controls: Array<any>;
    title?: string;
}

export const MaticoControlsPane: React.FC<MaticoControlsPaneInterface> = ({
    controls,
    title,
    id
}) => {
    const [mappedControls, filtersReady, _] = useNormalizeSpec(controls);
    if (!filtersReady) return <h1>Loading</h1>;

    return (
        <View width="100%" height="100%" position="relative">
            <Flex
                UNSAFE_style={{ backgroundColor: "white", height: "100%" }}
                direction="column"
                alignItems="stretch"
            >
                <Provider theme={lightTheme}>
                    <View padding="size-200">
                        <Heading>{title}</Heading>
                        <Flex direction="column" gap="size-200">
                            {mappedControls.map((controlSpec: Control) => {
                                switch (controlSpec.type) {
                                    case "range":
                                        return (
                                            <MaticoRangeControl
                                                min={controlSpec.min as number}
                                                max={controlSpec.max as number}
                                                step={
                                                    controlSpec.step as number
                                                }
                                                name={controlSpec.name}
                                            />
                                        );
                                    case "select":
                                        //@ts-ignore
                                        return (
                                            <MaticoSelectControl
                                                options={
                                                    controlSpec.options as Array<
                                                        string | number
                                                    >
                                                }
                                                name={controlSpec.name}
                                                defaultValue={
                                                    controlSpec.defaultValue
                                                }
                                            />
                                        );
                                    default:
                                        throw Error(
                                            //@ts-ignore
                                            `Unsupported filter type ${controlSpec.type}`
                                        );
                                }
                            })}
                        </Flex>
                    </View>
                </Provider>
            </Flex>
        </View>
    );
};
