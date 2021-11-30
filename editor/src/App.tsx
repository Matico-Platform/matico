import React, { useEffect, useState } from "react";
import "./App.css";
import examples from "./example_configs";
import ErrorBoundary from "./ErrorBoundary";
import { MaticoApp } from "matico_components";

const isEditActive = () => {
  const params = window.location.search
    .replace("?", "")
    .split("&")
    .map((p) => p.split("="));
  console.log("params are ", params);
  const editParam = params.find((p) => p[0] === "edit");
  if (editParam) {
    return editParam[1] === "true";
  } else {
    return false;
  }
};

function App() {
  const [edit, setEdit] = useState(false);
  let specString = localStorage.getItem("code");
  let spec;

  if (specString && JSON.parse(specString)) {
    spec = JSON.parse(specString);
  } else {
    spec = {
      name: "New Dashboard",
      created_at: new Date(),
      pages: [],
      datasets:[]
    };
  }

  useEffect(() => {
    setEdit(isEditActive());
    window.addEventListener("locationchange", function () {
      setEdit(isEditActive());
    });
  }, []);

  return (
    <ErrorBoundary>
      <div
        className="App"
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <MaticoApp
          basename={process.env.PUBLIC_URL}
          spec={spec}
          //@ts-ignore
          editActive={edit}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
