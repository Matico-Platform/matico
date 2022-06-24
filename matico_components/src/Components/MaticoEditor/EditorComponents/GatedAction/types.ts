import { BackgroundColorValue } from "@react-types/shared";
import React from "react";

export type GatedActionProps = {
    /**
     * @param {string} buttonText - The button text to open the gated action modal.
     */ 
    buttonText: string;
    /**
     * @param {string} confirmText - Additional warning or clarification text.
     */ 
    confirmText: string;
    /**
     * @param {string} confirmButtonText - The button text to confirm the action.
     */ 
    confirmButtonText: string;
    /**
     * @param {function} onConfirm - Action to take on confirmation, such as delete.
     */ 
    onConfirm: () => void;
    /**
     * @param {BackgroundColorValue} confirmBackgroundColor - The button background color, used to indicate severity or intent. Eg. Red - delete. Uses any React Spectrum color.
     */ 
    confirmBackgroundColor?: BackgroundColorValue;
    /**
     * @param {React.ReactNode} children - Additional arbitrary JSX elements that appear before the confirmation button.
     */ 
    children?: React.ReactNode;
};
