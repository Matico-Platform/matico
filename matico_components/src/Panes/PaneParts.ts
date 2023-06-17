import { PaneRef } from '@maticoapp/matico_types/spec';
import React from 'react'
import { MaticoStateVariable } from 'Stores/VariableTypes';


export interface PaneParts {
  pane: React.FC;
  label: string;
  //TODO find better type for this
  wrapper: (paneId: string, PaneImplementation: any) => any;
  section: "Vis" | "Control" | "Layout",
  editablePane?: React.FC<{ paneRef: PaneRef }>;
  registerVariables?: (paneId: string, paneRefId: string) => Array<MaticoStateVariable>;
  sidebarPane: React.FC;
  icon: React.FC | JSX.Element;
  defaults: { [key: string]: any };
  docs: string;
}
