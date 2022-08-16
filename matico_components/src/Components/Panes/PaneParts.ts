
export interface PaneParts {
    pane: React.FC;
    editablePane?: React.FC;
    sidebarPane: React.FC;
    icon: React.FC | JSX.Element;
    defaults: { [key: string]: any };
    docs: string
}