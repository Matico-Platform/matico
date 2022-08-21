import {
  Flex,
  ActionButton,
  TableBody,
  TableHeader,
  TableView,
  TextField,
  Column,
  View,
  Row,
  Cell,
} from "@adobe/react-spectrum";
import { Dataset } from "@prisma/client";
import { useState } from "react";
import { useDatasets } from "../../hooks/useDatasets";
import {NewDatasetModal} from "../DatasetCreation/NewDatasetModal";

interface DatasetSelector {
  onSelectDataset: (dataset: Dataset) => void;
}
export const DatasetSelector: React.FC<DatasetSelector> = ({
  onSelectDataset,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { datasets, error, mutate } = useDatasets({
    ownDatasets: true,
    collaboratorDatasets: true,
    publicDatasets: true,
    includeOwner: true,
    search: searchTerm,
  });

  return (
    <Flex direction={"column"}>
      <Flex direction="row" justifyContent='space-between' alignItems='center'>
      <TextField
        label="Search Datasets"
        value={searchTerm}
        onChange={(search) => setSearchTerm(search)}
      />
        <NewDatasetModal onSubmit={(dataset)=> onSelectDataset(dataset)}/>
      </Flex>
      
      <View>
      <TableView
        selectionMode={"single"}
        onSelectionChange={(selection) =>{
          const dataset = datasets.find(dataset=>dataset.id===selection.currentKey) 
          onSelectDataset(dataset)
        }
        }
      >
        <TableHeader>
          <Column>Name</Column>
          <Column>Description</Column>
          <Column>Owner</Column>
          <Column>Public</Column>
          <Column>Created</Column>
        </TableHeader>
        <TableBody>
          {(datasets ?? []).map((d: Dataset) => (
            <Row key={d.id}>
              <Cell>{d.name}</Cell>
              <Cell>{d.description}</Cell>
              <Cell>{d.owner.name}</Cell>
              <Cell>{d.public ? "Public" : "Private"}</Cell>
              <Cell>{d.createdAt}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </View>
    </Flex>
  );
};
