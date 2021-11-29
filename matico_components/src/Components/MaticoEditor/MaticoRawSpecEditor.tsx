import React, {useState,useEffect} from "react";
import AceEditor from "react-ace";
import ace, { Ace } from "ace-builds";
import { useValidator} from "../../Hooks/useValidator";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import {Box, List, Spinner} from "grommet";
import {useAppSpec} from "../../Hooks/useAppSpec";
import {useMaticoDispatch} from "../../Hooks/redux";
import {setSpec} from "../../Stores/MaticoSpecSlice";
import { json_error_to_annotation } from "./Utils";

export const MaticoRawSpecEditor: React.FC = () => {
  const [code, setCode] = useState<string>()
  const [isValid, setIsValid] = useState<boolean>(true)
  const [jsonError, setJsonError] = useState<any | null>(null)
  const [validationResult, setValidationResult] = useState<any[] | null>(null)

  const {validator, validatorReady} = useValidator()

  const spec = useAppSpec()
  const dispatch = useMaticoDispatch()

  //Need to figure out how to make sure this updates with other spec changes
  useEffect(()=>{
    setCode(JSON.stringify(spec,null,2))
  },[])

  const annotations: Ace.Annotation[] = jsonError
    ? json_error_to_annotation(jsonError)
    : [];

  useEffect(()=>{
    if(validatorReady){
      try{
        const dash = validator.Dashboard.from_json(code)
        const {is_valid: specValid, errors}=dash.is_valid()
        if(specValid){
          dispatch(setSpec(dash.to_js()))
          setIsValid(true)
          setJsonError(null)
          setValidationResult(null)
        }
        else{
          setIsValid(false)
          setValidationResult(errors)
        }
      }
      catch(e){
        setIsValid(false)
        setJsonError(e)
      }
    }
  },[JSON.stringify(code),validator,validatorReady])

  if(!validatorReady) return <Spinner />
  return (
    <Box fill background="white" flex direction="column" >
      <Box flex overflow={{vertical:"auto"}} style={{minHeight:"70vh"}}>
        <AceEditor
          mode={"json"}
          theme="github"
          onChange={(changes: any) => setCode(changes)}
          value={code}
          fontSize={20}
          annotations={annotations}
          style={{
            width: "100%",
            height:"100%",
            flex: 1,
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
        </Box>
      {(jsonError || validationResult) &&
        <Box height="small">
          <List data={[jsonError,...validationResult].filter(a=>a)} />
        </Box>
      }
    </Box>
  );
};
