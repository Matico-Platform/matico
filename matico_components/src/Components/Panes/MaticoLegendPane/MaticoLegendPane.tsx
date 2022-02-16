import React from "react";
import { Box } from "grommet";
import styled from "styled-components";
import { getColorScale } from "../MaticoMapPane/LayerUtils";

// interface MaicoMapPaneInterface extends MaticoPaneInterface {
//     view: View;
//     //TODO WE should properly type this from the @maticoapp/matico_spec library. Need to figure out the Typescript integration better or witx
//     base_map?: any;
//     layers?: Array<any>;
//     editPath?: string;
// }

const LegendOuterContainer = styled.div`
  position: absolute;
  right: 0.75em;
  bottom: 1.5em;
  display: flex;
  flex-direction: row;
  background: white;
  h3 {
  }
`;
const LegendInnerContainer = styled.div`
  display: block;
  h4 {
    margin: 0;
    padding: 0 0 0 0.125em;
    font-size: 0.7rem;
    text-align: left;
    box-shadow: none;
  }
`;
const LegendContent = styled.div`
  bottom: 2em;
  z-index: 1;
  min-height: 10px;
  padding: 0.75em;
  border-radius: 0.25em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  user-select: none;
  display: flex;
  flex-direction: row;
  h4 {
    padding: 0;
    margin: 0;
  }
`;

const LegendColors = styled.div`
  display: flex;
  flex-direction: column-reverse;
  span {
    width: 0.5rem;
    height: 1rem;
  }
`;

const LegendLabels = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 0.4rem 0 0.4em 0.5rem;
  justify-content: space-evenly;
  p {
    font-size: 0.7rem;
    font-family: "Lato", Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
    margin: 0;
    padding: 0;
    line-height: 1;
    text-align: left;
  }
`;
export const MaticoLegendPane = ({ layers = [] }) => {
  return layers && layers.length ? (
    <LegendOuterContainer>
      {layers.map((layer) =>
        layer?.colorScale?.domain && layer?.colorScale?.range ? (
          <LegendInnerContainer key={layer.name}>
            <h4>{layer.name}</h4>
            <LegendContent>
              <LegendColors>
                {"string" == typeof layer.colorScale.range
                  ? getColorScale(layer.colorScale.range)[0]
                    ? getColorScale(layer.colorScale.range)[0].map((color) => (
                        <span key={color} style={{ backgroundColor: color }} />
                      ))
                    : null
                  : layer?.colorScale?.range
                  ? layer.colorScale.range.map((d) => (
                      <span
                        key={`rgb(${d.slice(0, 3).join(",")})`}
                        style={{
                          backgroundColor: `rgb(${d.slice(0, 3).join(",")})`,
                        }}
                      />
                    ))
                  : null}
              </LegendColors>
              <LegendLabels>
                {!!layer?.colorScale?.domain &&
                  layer.colorScale.domain
                    .slice(1)
                    .map((d) => (
                      <p key={Math.round(d).toLocaleString("en")}>
                        {Math.round(d).toLocaleString("en")}
                      </p>
                    ))}
              </LegendLabels>
            </LegendContent>
          </LegendInnerContainer>
        ) : null
      )}
    </LegendOuterContainer>
  ) : null;
};

