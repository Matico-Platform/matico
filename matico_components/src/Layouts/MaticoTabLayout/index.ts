import { LayoutParts } from "../LayoutParts"
import { TabLayoutContainer } from "./TabLayoutContainer"
import { TabLayoutPaneWrapper } from "./TabLayoutPaneWrapper"
import Default from "./default"
import { TabLayoutEditor } from './TabLayoutEditor'

const TabPaneParts: LayoutParts = {
  type: "tab",
  Container: TabLayoutContainer,
  PaneWrapper: TabLayoutPaneWrapper,
  onDropFromSelf: () => false,
  onDropFromOther: () => false,
  label: "Tabs",
  Editor: TabLayoutEditor,
  //@ts-ignore
  default: Default
}
export default TabPaneParts
