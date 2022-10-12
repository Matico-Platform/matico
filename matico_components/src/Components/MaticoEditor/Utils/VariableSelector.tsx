import React from "react";
import {
    Picker,
    Section,
    Item,
    ActionButton,
    Dialog,
    DialogTrigger,
    Content,
    Heading
} from "@adobe/react-spectrum";
import { useMaticoSelector } from "Hooks/redux";
import { Variable } from "@maticoapp/matico_types/spec";
import { MaticoStateVariable } from "index";

interface VariableSelectorProps {
    variable?: Variable;
    onSelectVariable: (variable: Variable) => void;
    allowedTypes: Array<string>;
}

function suboptionsForVariableType(variable: MaticoStateVariable) {
    if (!variable) return null;
    switch (variable.value.type) {
        case "range":
            return [
                { id: "min", name: "Min" },
                { id: "max", name: "Max" }
            ];
        case "mapview":
            return [
                { id: "lat", name: "Latitude" },
                { id: "lng", name: "Longitude" },
                { id: "zoom", name: "Zoom" },
                { id: "pitch", name: "Pitch" },
                { id: "bearing", name: "Bearing" }
            ];
        case "dateRange":
            return[
              {id: "min", name:"min"},
              {id:"max", name:'max'}
            ]
        default:
            return Object.keys(variable.value.value).map((so) => ({
                name: so,
                id: so
            }));
    }
}
export const VariableSelector: React.FC<VariableSelectorProps> = ({
    variable,
    onSelectVariable
}) => {
    const [options, vars] = useMaticoSelector((state) => {
        let vars = Object.values(state.variables.autoVariables);
        let panesIds = Array.from(
            new Set(
                state.spec.spec.panes
                    .filter((p) =>
                        [
                            "controls",
                            "histogram",
                            "scatterplot",
                            "dateTimeSlider",
                            "map"
                        ].includes(p.type)
                    )
                    .map((p) => p.id)
            )
        );
        let sections: Array<{ name: string; items: Array<any> }> = [];
        panesIds.forEach((pid) => {
            const paneName = state.spec.spec.panes.find(
                (p) => p.id === pid
            ).name;
            const variables = vars.filter((v) => v.paneId === pid);
            sections.push({ name: paneName, items: variables });
        });
        return [sections, vars];
    });

    const selectedVar = variable
        ? vars.find((v) => v.id === variable.varId)
        : null;
    // const suboptions = selectedVar? Object.keys(selectedVar.value.value).map(so => ({name:so, id:so})): null

    const suboptions = suboptionsForVariableType(selectedVar);

    return (
        <DialogTrigger type="popover" isDismissable={true}>
            <ActionButton>
                {selectedVar ? selectedVar.name : "Select filter variable"}
            </ActionButton>
            {(close) => (
                <Dialog>
                    <Content>
                        <Heading>Variable</Heading>
                        <Picker
                            label={"Select variable to use"}
                            width={"100%"}
                            items={options}
                            onSelectionChange={(variableId) =>
                                onSelectVariable({
                                    varId: variableId as string,
                                    property: null
                                })
                            }
                            selectedKey={selectedVar?.id}
                        >
                            {(section) => (
                                <Section
                                    key={section.name}
                                    items={section.items}
                                    title={section.name}
                                >
                                    {(v) => <Item key={v.id}>{v.name}</Item>}
                                </Section>
                            )}
                        </Picker>
                        {suboptions && (
                            <Picker
                                label={"Property"}
                                items={suboptions}
                                width={"100%"}
                                selectedKey={variable.property}
                                onSelectionChange={(property) =>
                                    onSelectVariable({
                                        ...variable,
                                        property: property as string
                                    })
                                }
                            >
                                {(item) => (
                                    <Item key={item.id}>{item.name} </Item>
                                )}
                            </Picker>
                        )}
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
