import React, { useState } from "react";
import chroma from "chroma-js";
import { SketchPicker } from "react-color";

interface ColorPicker {
  color: string | [number, number, number, number?];
  onChange: (newVal: string | [number, number, number, number?]) => void;
  outFormat: "hex" | "rgba";
}

export const ColorPicker: React.FC<ColorPicker> = ({
  color,
  onChange,
  outFormat,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  let chromaColor;

  console.log("color is ", color);
  if (Array.isArray(color)) {
    chromaColor = chroma.rgb([...color.slice(0, 3), color[3] / 255]);
  } else {
    chromaColor = chroma(color);
  }

  const rgbaColor = chromaColor.rgba();
  return (
    <>
      <div
        style={{
          width: "100%",
          flex: 1,
          height: "30px",
          border: "1px solid black",
        }}
      >
        <div
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: "100%",
            height: "30px",
            boxSizing: "border-box",
            padding: "10px 5px",
            backgroundColor: chromaColor.hex(),
            cursor: "pointer",
          }}
        />
        {showPicker && (
          <div style={{ position: "relative", zIndex: 20 }}>
            <SketchPicker
              color={{
                r: rgbaColor[0],
                g: rgbaColor[1],
                b: rgbaColor[2],
                a: rgbaColor[3],
              }}
              onChange={({ rgb, hex }) => {
                if (outFormat === "hex") {
                  onChange(hex);
                } else {
                  onChange([rgb.r, rgb.g, rgb.b]);
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
