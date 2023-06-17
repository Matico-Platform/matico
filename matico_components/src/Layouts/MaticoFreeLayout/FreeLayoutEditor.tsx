import { FreeLayout } from '@maticoapp/matico_types/spec';
import React from 'react'

export interface FreeLayoutEditorProps {
  layout: FreeLayout;
  paneRefId: string;
}

export const FreeLayoutEditor: React.FC<{ type: 'free' } & FreeLayoutEditorProps> = ({
  layout,
  paneRefId
}) => {
  return <></>;
};

