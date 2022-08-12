import React from "react";

export type CollapsibleSectionProps = {
    /**
     * @param {string} title - The section header for the collapsible section
     */ 
    title: string;
    /**
     * @param {React.ReactNode} icon - Optional icon to show in the title bar
     */ 
    icon?: React.ReactNode;
    /**
     * @param {React.ReactNode} children - The child elements displayed in this section.
     */ 
    children: React.ReactNode;
    /**
     * @param {boolean} isOpen - Optional default open state. Defaults to false.
     */ 
    isOpen?: boolean;
    /**
     * @param {function} onToggle - Optional side effect triggering on open/close.
     */ 
    onToggle?: (isOpen: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    titleClassName?: string;
}
