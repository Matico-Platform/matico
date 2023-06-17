import { LayoutParts } from "../LayoutParts";
import { FreeLayoutContainer } from "./FreeLayoutContainer"
import { FreeLayoutPaneWrapper } from "./FreeLayoutPaneWrapper"
import { FreeLayoutEditor } from "./FreeLayoutEditor"
import Default from "./default"

const MaticoFreeLayoutParts: LayoutParts = {
  Container: FreeLayoutContainer,
  PaneWrapper: FreeLayoutPaneWrapper,
  onDropFromOther: () => { return false },
  onDropFromSelf: () => { return false },
  type: "free",
  label: "Free",
  Editor: FreeLayoutEditor,
  default: Default
}

export default MaticoFreeLayoutParts
