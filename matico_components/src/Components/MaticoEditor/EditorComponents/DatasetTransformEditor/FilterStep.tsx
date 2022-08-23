import React from 'react'
import {DialogTrigger, ActionButton, Dialog, Content, Flex, Picker, Item, NumberField, ToggleButton, Divider, Text } from '@adobe/react-spectrum';
import {VariableSelector} from 'Components/MaticoEditor/Utils/VariableSelector';
import {Column} from '@maticoapp/matico_types/api/Column';
import {FilterStep,Filter} from '@maticoapp/matico_types/spec';
import FunctionIcon from "@spectrum-icons/workflow/Function";
import {FilterEditor} from 'Components/MaticoEditor/Utils/FilterEditor';
import {DatasetColumnSelector} from 'Components/MaticoEditor/Utils/DatasetColumnSelector';

interface FilterEditor {
    datasetId: string, 
    selectedColumn: Column;
    onUpdateFilter: (newFilter: any) => void;
}

interface RangeFilterEditorProps extends FilterEditor {
    min?: number | { var: string };
    max?: number | { var: string };
}

interface CategoryFilterProps extends FilterEditor {
    categories: Array<string>;
}

export const FilterStepEditor: React.FC<{
    filterStep: FilterStep;
    onChange: (update: Partial<FilterStep>) => void;
    datasetId: string;
}> = ({ filterStep, onChange, datasetId }) => {

  const updateFilterAtIndex= (update:Filter,index:number)=>{
    console.log("update ", update, " index ", index)
    onChange({filters: filterStep.filters.map((filter:Filter,i:number)=>
      index===i ? update : filter 
                                     )})
  }

    return (
          <Flex direction="row" gap={"size-300"}>
            <Flex direction="column" width="size-1000">
              <Text>Filters allow you to select a subset of dataset rows based on some kind of condition</Text>
            </Flex>
              <Divider orientation="vertical" size="S" />
            <Flex direction="column" gap="size-200">
              {filterStep.filters.map((f,index)=>
                f.type==='range' ? 
                <RangeFilterEditor 
                  datasetId={datasetId}
                  selectedColumn={{name:f.variable, colType:"number"}}
                  max ={f.max}
                  min ={f.min}
                  onUpdateFilter={(update)=> updateFilterAtIndex(update,index)}
                  />
                  :
                <CategoryFilter
                  datasetId={datasetId}
                  selectedColumn={{name:f.variable, colType:"number"}}
                  categories={[]}
                  onUpdateFilter={(update)=> onChange(update)}
                  />
              )}

                  <FilterTypeDialog onSubmit={(newFilter) =>onChange({filters: [...filterStep.filters, newFilter]})}/>
            </Flex>
        </Flex>
    );
};

const FilterTypeDialog: React.FC<{ onSubmit: (newFilter: any) => void }> = ({
    onSubmit
}) => {
    return (
        <DialogTrigger isDismissable type="popover">
            <ActionButton>Add Filter</ActionButton>
            {(close) => (
                <Dialog>
                    <Content>
                        <Flex direction="column">
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                            variable: null,
                                            min: 0,
                                            max: 100,
                                            type:'range'
                                    });
                                    close();
                                }}
                            >
                                Range
                            </ActionButton>
                            <ActionButton
                                onPress={() => {
                                    onSubmit({
                                            variable: null,
                                            is_one_of: [],
                                            type:'category'
                                    });
                                    close();
                                }}
                            >
                                Category
                            </ActionButton>
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};


const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
    datasetId,
    min,
    max,
    onUpdateFilter,
    selectedColumn
}) => {

    const toggleVariableMin = () => {
        if (typeof min === "number") {
            onUpdateFilter({
                variable: selectedColumn.name, max, min: { varId: null, property: min },  type:'range'
            });
        } else {
            onUpdateFilter({
                variable: selectedColumn.name, max, min: 0,type:'range' 
            });
        }
    };
    const toggleVariableMax = () => {
        if (typeof max === "number") {
            onUpdateFilter({
                 variable: selectedColumn.name, max: { varId: null, property: 'max' }, min, type: 'range' 
            });
        } else {
            onUpdateFilter({
                 variable: selectedColumn.name, max: 0, min, type: 'range' 
            });
        }
    };

    console.log("Type min max ",typeof(min) , typeof(max))

    return (
        <Flex direction="row" gap="size-100" alignItems="end">
            <DatasetColumnSelector datasetName={datasetId}
            selectedColumn={selectedColumn.name}
            onColumnSelected={(column)=>
                        onUpdateFilter({
             variable: column.name, min, max ,type:"range"
                        })
            }/>
            {typeof min === "number" ? (
                <NumberField
                    key="min_val"
                    value={min}
                    label="min"
                    onChange={(min) =>
                        onUpdateFilter({
                            type:'range', variable: selectedColumn.name, min, max 
                        })
                    }
                />
            ) : (
                <VariableSelector
                    variable={min.var}
                    allowedTypes={["range"]}
                    onSelectVariable={(newVar) =>
                        onUpdateFilter({
                                max,
                                min: { var: newVar },
                                variable: selectedColumn.name,
                                type:'range'
                        })
                    }
                />
            )}
            <ToggleButton
                isEmphasized
                isSelected={typeof min !== "number"}
                onPress={toggleVariableMin}
            >
                <FunctionIcon />
            </ToggleButton>

            {typeof max === "number" ? (
                <NumberField
                    value={max}
                    label="max"
                    key="max_val"
                    onChange={(max) =>
                        onUpdateFilter({
                           type:'range', variable: selectedColumn.name, max, min 
                        })
                    }
                />
            ) : (
                <VariableSelector
                    variable={max.var}
                    onSelectVariable={(newVar) =>
                        onUpdateFilter({
                                type:"range",
                                max: { var: newVar },
                                min,
                                variable: selectedColumn.name
                        })
                    }
                />
            )}
            <ToggleButton
                isEmphasized
                isSelected={typeof max !== "number"}
                onPress={toggleVariableMax}
            >
                <FunctionIcon />
            </ToggleButton>
        </Flex>
    );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    datasetId,
    selectedColumn,
    categories,
    onUpdateFilter
}) => {
    return (
        <Flex direction="row">
            <DatasetColumnSelector datasetName={datasetId}
              selectedColumn={selectedColumn}
              onColumnSelected={(column)=>
                        onUpdateFilter({
                range: { variable: column.name, min, max }
                        })
            }/>
        </Flex>
    );
};
