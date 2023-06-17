import React, { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  Heading,
  repeat,
  SearchField,
  View
} from "@adobe/react-spectrum";

export interface MaticoCateogrySelectorInterface {
  categories: Array<{ name: string, count: number }>,
  name: string,
  selection: { oneOf: Array<string>, notOneOf: Array<string> },
  onSelectionChanged: (update: { oneOf: Array<string>, notOneOf: Array<string> }) => void
}


export const MaticoCategorySelector: React.FC<
  MaticoCateogrySelectorInterface
> = ({ categories, selection, onSelectionChanged, name }) => {

  const [search, setSearch] = useState<string | null>(null);

  const filteredOptions = categories.filter((c: any) =>
    search && search.length ? c.name.includes(search) : true
  );

  const selectAll = () => {
    onSelectionChanged({
      oneOf: categories.map((v: any) => v.name).filter((f: any) => f !== null || f !== undefined),
      notOneOf: []
    })
  };

  const selectNone = () => {
    onSelectionChanged({ oneOf: [], notOneOf: [] })
  };

  return (
    <View
      width="100%"
      height="100%"
      position="relative"
      backgroundColor={"gray-200"}
      overflow="hidden"
    >
      <View
        width={"100%"}
        height={"100%"}
        paddingX="size-200"
        UNSAFE_style={{ boxSizing: "border-box" }}
      >
        <Flex direction="column" width="100%" height="100%">
          <Flex
            direction="row"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Heading flex={1}>{name}</Heading>
            <SearchField
              value={search}
              aria-label="Filter Categories"
              onChange={(search) => setSearch(search)}
            />
          </Flex>
          <>
            <View
              flex={1}
              overflow={{ y: "auto" }}
              id="container"
            >
              <CheckboxGroup
                value={selection.oneOf}
                aria-label="Categories"
                onChange={(keys) => {
                  onSelectionChanged({
                    oneOf: keys,
                    notOneOf: []
                  });
                }}
                flex={1}
              >
                <Grid
                  columns={repeat(
                    "auto-fit",
                    "size-2000"
                  )}
                  justifyContent="space-around"
                  gap="size-100"
                  width="100%"
                  height="100%"
                >
                  {filteredOptions.map((c: any) => (
                    <Checkbox
                      key={c.name}
                      value={`${c.name}`}
                      aria-label={c.name}
                    >
                      {c.name} ({c.count})
                    </Checkbox>
                  ))}
                </Grid>
              </CheckboxGroup>
            </View>
            <Flex direction="row">
              <Button
                variant="secondary"
                onPress={selectAll}
                aria-label="Select All"
              >
                Select All
              </Button>
              <Button
                variant="secondary"
                onPress={selectNone}
                aria-label="Select None"
              >
                Select None
              </Button>
            </Flex>
          </>
        </Flex>
      </View>
    </View>
  );
};
