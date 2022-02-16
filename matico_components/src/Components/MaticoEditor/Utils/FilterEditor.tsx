import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
  Heading,
  Item,
  ListBox,
  NumberField,
  Picker,
  Text,
  TextField,
  ToggleButton,
} from "@adobe/react-spectrum";
import { DatasetState, Filter } from "Datasets/Dataset";
import { useMaticoSelector } from "Hooks/redux";
import React from "react";
import { CategoryFilter, Column } from "../../../../dist/Datasets/Dataset";
import FunctionIcon from "@spectrum-icons/workflow/Function";

interface FilterEditor {
  columns: Array<Column>;
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

const RangeFilterEditor: React.FC<RangeFilterEditorProps> = ({
  columns,
  selectedColumn,
  min,
  max,
  onUpdateFilter,
}) => {
  console.log("selected column ", selectedColumn);

  const toggleVariableMin = () => {
    if (typeof min === "number") {
      onUpdateFilter({
        Range: { variable: selectedColumn.name, max, min: { var: "" } },
      });
    } else {
      onUpdateFilter({ Range: { variable: selectedColumn.name, max, min: 0 } });
    }
  };
  const toggleVariableMax = () => {
    if (typeof max === "number") {
      onUpdateFilter({
        Range: { variable: selectedColumn.name, max: { var: "" }, min },
      });
    } else {
      onUpdateFilter({ Range: { variable: selectedColumn.name, max: 0, min } });
    }
  };
  return (
    <Flex direction="row" gap="size-100" alignItems="end">
      <Picker
        label="column"
        items={columns}
        selectedKey={selectedColumn?.name}
        onSelectionChange={(variable) =>
          onUpdateFilter({ Range: { variable, max, min } })
        }
      >
        {(column) => <Item key={column.name}>{column.name}</Item>}
      </Picker>

      {typeof min === "number" ? (
        <NumberField
          value={min}
          label="min"
          onChange={(min) =>
            onUpdateFilter({
              Range: { variable: selectedColumn.name, min, max },
            })
          }
        />
      ) : (
        <TextField
          width={"size-1200"}
          label="Min variable"
          value={min.var}
          onChange={(newVar) =>
            onUpdateFilter({
              Range: {
                min: { var: newVar },
                max,
                variable: selectedColumn.name,
              },
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
          onChange={(max) =>
            onUpdateFilter({
              Range: { variable: selectedColumn.name, max, min },
            })
          }
        />
      ) : (
        <TextField
          label="Max variable"
          width={"size-1200"}
          value={max.var}
          onChange={(newVar) =>
            onUpdateFilter({
              Range: {
                max: { var: newVar },
                min,
                variable: selectedColumn.name,
              },
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
  columns,
  selectedColumn,
  categories,
  onUpdateFilter,
}) => {
  return (
    <Flex direction="row">
      <Picker label="column" items={columns} selectedKey={selectedColumn?.name}>
        {(column) => <Item key={column.name}>{column.name}</Item>}
      </Picker>
    </Flex>
  );
};

const editorForFilter = (
  filter: any,
  columns: Array<Column>,
  updateFilter: (newFilter: Filter) => void
) => {
  console.log("TRYING TO GET EDITOR FOR FILTER ", filter);
  const [filterType, filterParams] = Object.entries(filter)[0];
  if (filterType === "Range") {
    return (
      <RangeFilterEditor
        key={JSON.stringify({ filterParams })}
        selectedColumn={columns.find((c) => c.name === filterParams.variable)}
        columns={columns}
        max={filterParams.max}
        min={filterParams.min}
        onUpdateFilter={updateFilter}
      />
    );
  } else if (filterType === "Category") {
    return (
      <CategoryFilter
        key={JSON.stringify({ filterParams })}
        selectedColumn={columns.find((c) => c.name === filterParams.variable)}
        columns={columns}
        categories={filterParams.is_one_of}
        onUpdateFilter={updateFilter}
      />
    );
  }
  return <Text>Failed to get filter type</Text>;
};

const FilterTypeDialog: React.FC<{ onSubmit: (newFilter: any) => void }> = ({
  onSubmit,
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
                  onSubmit({ Range: { variable: null, min: 0, max: 100 } });
                  close();
                }}
              >
                Range
              </ActionButton>
              <ActionButton
                onPress={() => {
                  onSubmit({ Category: { variable: null, is_one_of: [] } });
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

interface FilterEditorProps {
  filters: Array<any>;
  onUpdateFilters: (update: any) => void;
  datasetName: string;
}
export const FilterEditor: React.FC<FilterEditorProps> = ({
  filters,
  onUpdateFilters,
  datasetName,
}) => {
  const dataset = useMaticoSelector(
    (state) => state.datasets.datasets[datasetName]
  );

  console.log("Filters to iterate over ", filters);
  const columns =
    dataset && dataset.state === DatasetState.READY ? dataset.columns : [];

  const addFilter = (newFilter: Filter) =>
    onUpdateFilters(filters ? [...filters, newFilter] : [newFilter]);
  const updateFilter = (newFilter: Filter, index: Number) =>
    onUpdateFilters(
      filters.map((filter, i) => (i === index ? newFilter : filter))
    );

  return (
    <Flex direction="column">
      <Heading>
        <Flex direction="row" justifyContent="space-between">
          <Text>Filters</Text> <FilterTypeDialog onSubmit={addFilter} />
        </Flex>
      </Heading>
      <Flex direction="column">
        {filters?.map((filter, index) =>
          editorForFilter(filter, columns, (newFilter: Filter) =>
            updateFilter(newFilter, index)
          )
        )}
      </Flex>
    </Flex>
  );
};
