import React, { useState, useEffect, useContext } from "react";
import { MaticoDataContext } from "../Contexts/MaticoDataContext/MaticoDataContext";
import { useBufferAnalysis } from "../Hooks/useTesAnalysis";
import { Box, Text } from "grommet";

export const DatasetMeta: React.FC = () => {
  const { state, dispatch } = useContext(MaticoDataContext);
  const [meta, setMeta] = useState([]);
  const { datasets } = state;

  const [analysis, ready] = useBufferAnalysis();

  useEffect(() => {
    if (ready) {
      setMeta(
        datasets.map((d) => {
          //@ts-ignore
          const metaData = analysis.buffer(d.getArrow());

          console.log(
            "dataset meta from wasm ",
            d.name,
          //@ts-ignore
            d.getArrow(),
            metaData
          );
          return metaData;
        })
      );
    }
  }, [datasets, ready, analysis]);

  return (
    <Box>
      {meta.map((m) => (
        <Text>{m}</Text>
      ))}
    </Box>
  );
};
