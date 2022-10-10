import { Button } from "@adobe/react-spectrum";
import styled from "styled-components";
import { SpectrumButtonProps } from "@react-types/button";

export const CompactHorizontalButton: typeof Button = styled(
    Button
)<SpectrumButtonProps>`
    border-radius: 0 !important;
    background: var(--spectrum-global-color-gray-300) !important;
    color: var(--spectrum-global-color-gray-900) !important;
    span {
        text-align: left !important;
    }
`;
