import {PanePosition} from 'matico_spec'

export interface MaticoPaneInterface{
  position: PanePosition,
  name: string,
  background: string,
  edtiPath?: string
}
