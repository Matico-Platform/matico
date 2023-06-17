import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PaneDefs } from "Panes"
import { isEditingAtom } from "Stores/StateAtoms";
import { useRecoilValue } from "recoil";
import { editTargetAtom } from "Stores/StateAtoms"
import { paneRefAtomFamily, paneWithRefSelector } from "Stores/SpecAtoms";


export const PaneSelector: React.FC<{
  paneRefId: string
}> = ({ paneRefId }) => {

  const { paneRef, pane } = useRecoilValue(paneWithRefSelector(paneRefId))
  const isEdit = useRecoilValue(isEditingAtom);
  const currentEditElement = useRecoilValue(editTargetAtom);

  let PaneParts = PaneDefs[paneRef.type]

  if (pane.type != paneRef.type) { throw Error("Missatched pane types") }

  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p style={{ color: 'red' }}>{error.message}</p>
        </div>)
    }
    }>
      <React.Suspense fallback={() => <h1>Loading...</h1>}>
        {isEdit && currentEditElement.id === paneRefId && PaneParts.editablePane ?
          <PaneParts.editablePane paneRef={paneRef} />
          :
          <PaneParts.pane paneRef={paneRef} />
        }
      </React.Suspense>
    </ErrorBoundary>
  );
};
