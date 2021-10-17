import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import AceEditor from "react-ace";
import ace, { Ace } from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import { useSpec } from "./hooks/useSpec";
import { ValidationResult, Dashboard } from "matico_spec";
import { MaticoApp } from "matico_components";

function json_error_to_annotation(error: string) {
  const rg = /(.*)at line (\d+) column (\d+)/;
  const parts = error.match(rg);
  if (parts) {
    return [
      {
        row: parseInt(parts[2]) - 1,
        column: parseInt(parts[3]) - 1,
        type: "error",
        text: parts[1],
      },
    ] as Ace.Annotation[];
  }
  console.log("Failed to parse error ", error);
  return [] as Ace.Annotation[];
}

function App() {
  const [code, setCode] = useState<string>("{}");
  const [spec, isReady] = useSpec();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [parseResult, setParseResult] = useState<ValidationResult | null>(null);
  const [validJSON, setValidJSON] = useState<boolean>(true);
  const [jsonError, setJsonError] = useState<any | null>(null);

  const annotations: Ace.Annotation[] = jsonError
    ? json_error_to_annotation(jsonError)
    : [];

  useEffect(() => {
    if (spec && isReady) {
      try {
        const dash = spec.Dashboard.from_json(code);
        setParseResult(dash.is_valid());
        setDashboard(dash)
        if(dash.is_valid()){
          console.log(dash.to_yaml());
        }
        setValidJSON(true);
        setJsonError(null);
      } catch (e) {
        setValidJSON(false);
        setJsonError(e);
        console.log("Error is ", e);
      }
    }
  }, [spec, isReady, code]);

  useEffect(() => {
    if (spec && isReady) {
      const storedCode = window.localStorage.getItem("code");
      if (storedCode && storedCode!=="{}") {
        setCode(storedCode);
        try{
          const dash = spec.Dashboard.from_json(storedCode);
          setDashboard(dash)
        }
        catch{
        }
      } else {
      const newDash = new spec.Dashboard();
      setDashboard(newDash);
      setCode(JSON.stringify(newDash.to_js(), null, 2));
      }
    }
  }, [spec, isReady]);

  useEffect(() => {
    if(code !=="{}"){
      console.log("updating local storage");
      window.localStorage.setItem("code", code);
    }
  }, [code]);

  const reset = () => {
    const newDash = new spec.Dashboard();
    setCode(JSON.stringify(newDash.to_js(), null, 2));
  };

  const pretty = () => {
    const newCode = JSON.stringify(JSON.parse(code), null, 2);
    setCode(newCode);
  };

  return (
    <div
      className="App"
      style={{
        display: "grid",
        gridTemplateColumns: "min-content 1fr",
        gridTemplateRows: "1fr 100px",
        gridTemplateAreas: `
        "code result"
        "errors actions"`,
        alignItems:"center",
        justifyContent:"stretch",
        height: "100%",
        width: "100%",
      }}
    >
      <AceEditor
        mode={"json"}
        theme="github"
        onChange={(changes: any) => setCode(changes)}
        value={code}
        fontSize={20}
        annotations={annotations}
        style={{ gridArea: "code", width:"100%", minWidth:"500px",height:"100%",resize: "horizontal"}}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
      <div style={{ gridArea: "result", width:"100%", height:"100%" }}>
        {dashboard && <MaticoApp spec={dashboard.to_js()} />}
      </div>
      <div style={{ gridArea: "errors" }}>
        {validJSON
          ? JSON.stringify(parseResult, null, 2)
          : `Invalid JSON  ${jsonError}`}
      </div>
      <div style={{ gridArea: "actions" }}>
        <button onClick={reset}>Reset</button>
        <button onClick={pretty}>Make Pretty</button>
      </div>
    </div>
  );
}

export default App;
