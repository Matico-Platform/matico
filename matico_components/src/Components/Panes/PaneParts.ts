
export interface PaneParts {
    pane: React.FC | JSX.Element;
    editablePane?: React.FC | JSX.Element;
    sidebarPane: React.FC | JSX.Element;
    icon: React.FC | JSX.Element;
    defaults: { [key: string]: any };
}