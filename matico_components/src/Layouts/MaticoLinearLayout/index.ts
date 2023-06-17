import { LayoutParts } from "../LayoutParts"
import { LinearLayoutContainer } from "./LinearLayoutContainer"
import { LinearLayoutPaneWrapper } from "./LinearLayoutPaneWrapper"
import { LinearLayoutEditor } from "./LinearLayoutEditor"
import Default from "./default"

const TabPaneParts: LayoutParts = {
  type: "linear",
  Container: LinearLayoutContainer,
  PaneWrapper: LinearLayoutPaneWrapper,
  onDropFromSelf: () => false,
  onDropFromOther: () => false,
  Editor: LinearLayoutEditor,
  label: "Linear",
  default: Default
}
export default TabPaneParts
