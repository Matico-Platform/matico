import React, { useState, useEffect, useMemo } from "react";
import AceEditor from "react-ace";
import ace, { Ace } from "ace-builds";
import { useValidator } from "Hooks/useValidator";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import { useAppSpec } from "Hooks/useAppSpec";
import { useMaticoDispatch } from "Hooks/redux";
import { setSpec } from "Stores/MaticoSpecSlice";
import { json_error_to_annotation } from "../Utils/Utils";
import { Flex, ProgressCircle, Text, View, Well } from "@adobe/react-spectrum";

export const MaticoRawSpecEditor: React.FC = () => {
  const [code, setCode] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(true);
  const [jsonError, setJsonError] = useState<any | null>(null);
  const [validationResult, setValidationResult] = useState<any[] | null>(null);

  const { validator, validatorReady, error: validatorError} = useValidator();

  const spec = useAppSpec();
  const dispatch = useMaticoDispatch();

  //Need to figure out how to make sure this updates with other spec changes
  useEffect(() => {
    setCode(JSON.stringify(spec, null, 2));
  }, []);

  const annotations: Ace.Annotation[] = jsonError
    ? json_error_to_annotation(jsonError)
    : [];

  useEffect(() => {
    if (validatorReady) {
      try {
        const dash = validator.Dashboard.from_json(code);
        const { is_valid: specValid, errors } = dash.is_valid();
        if (specValid) {
          dispatch(setSpec(dash.to_js()));
          setIsValid(true);
          setJsonError(null);
          setValidationResult([]);
        } else {
          setIsValid(false);
          setValidationResult(errors);
        }
      } catch (e) {
        setIsValid(false);
        setJsonError(e);
      }
    }
  }, [JSON.stringify(code), validator, validatorReady]);

  if (validatorError) return <h1>Failed to load validator wasm </h1>

  const combinedErrors = useMemo(() => {
    let combinedErrors = []
    if(jsonError){
      combinedErrors.push(jsonError)
    }
    if(validationResult){
      combinedErrors = combinedErrors.concat(validationResult)
    }
    return combinedErrors.filter((a) => a)
  },[jsonError, validationResult])

  if (!validatorReady) return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  return (
    <Flex direction="column" minHeight={{L:"95vh",M:"95vh",S:"35vh",base:"35vh"}} height="auto" position="relative">
      <AceEditor
        mode={"json"}
        theme="github"
        onChange={(changes: any) => setCode(changes)}
        value={code}
        fontSize={20}
        annotations={annotations}
        style={{
          width: "100%",
          height: "auto",
          flex: 1,
        }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
      {(jsonError || validationResult) && (
        <View position="absolute" bottom="5%" left="20%" width="60%" backgroundColor="negative">
          {!!combinedErrors && combinedErrors.length && <ul>
              {combinedErrors.map(err => <li><Text>{err}</Text></li>)}
            </ul>}
        </View>
      )}
    </Flex>
  );
};
