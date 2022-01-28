import React, { useEffect, useState } from "react";
import { View, Flex, Button, Text } from "@adobe/react-spectrum";
import AceEditor from "react-ace";
import brace from 'brace';
import 'brace/mode/sql';
import 'brace/mode/c_cpp';
import 'brace/theme/twilight';
import 'brace/theme/xcode';

export interface QueryEditorProps {
  query: string;
  onQueryChange?: (newQuery: any) => void;
}

export const QueryEditor: React.FC<QueryEditorProps> = ({
  onQueryChange,
  query,
}) => {

  // const [localQuery, setLocalQuery] = useState<string | null>(null)
  // useEffect(()=>{
  //   if(!localQuery){
  //     setLocalQuery(query)
  //   }
  // },[query, localQuery])

  // const updateQuery = (query:string)=>{
  //   if(onQueryChange){
  //      onQueryChange(query)
  //   } 
  //   setLocalQuery(query)
  // }
 
  // if(!localQuery) return <h2>Loading</h2>
  return (
      <AceEditor
        mode="sql"
        theme="twilight"
        value={query}
        onChange={onQueryChange}
        name="sql"
        fontSize="25px"
        style={{ width: "100%", flex: 1, minHeight:"400px" }}
        editorProps={{ $blockScrolling: true }}
      />
  );
};
