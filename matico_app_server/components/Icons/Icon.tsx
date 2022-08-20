import React from "react";
import styled from "styled-components";
import * as Svg from "./svgs";

const StyledIcon = styled.div<{ fillColor?: string; size?: string }>`
  display: inline-block;
  width: ${({ size }) => size || "1em"};
  height: ${({ size }) => size || "1em"};
  margin-right: 1em;
  svg {
    width: 100%;
    height: 100%;
    fill: ${({ fillColor }) =>
      fillColor || "var(--spectrum-alias-text-color-selected-neutral)"};
  }
`;

export const Icon: React.FC<{
  icon: string;
  fillColor?: string;
  size?: string;
}> = ({ icon, fillColor, size }) => {
  // @ts-ignore
  const IconSvg = Svg[icon];
  if (!IconSvg) return null
  return (
    <StyledIcon {...{ size, fillColor }}>
      <IconSvg />
    </StyledIcon>
  );
};
