export interface PaneParts {
    pane: React.FC;
    label: string;
    section: "Vis" | "Control" | "Layout",
    editablePane?: React.FC;
    sidebarPane: React.FC;
    icon: React.FC | JSX.Element;
    defaults: { [key: string]: any };
    docs: string;
}
