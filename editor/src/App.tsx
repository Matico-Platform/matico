import React, { useEffect, useState } from "react";
import "./App.css";
import examples from "./example_configs";
import ErrorBoundary from "./ErrorBoundary";
import { MaticoApp } from "matico_components";

function App() {
  const spec = localStorage.getItem("code");

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
            spec={JSON.parse(spec!)}
            editActive={true}
          />
      </div>
    </ErrorBoundary>
  );
}

export default App;
