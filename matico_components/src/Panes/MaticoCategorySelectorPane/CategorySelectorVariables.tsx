import { MaticoStateVariable } from "Stores/VariableTypes"

export const registerVariables = (paneId: string, paneName: string) => {
  let id = `${paneId}_selected_categories`

  let variables: Array<MaticoStateVariable> = [{
    id,
    paneId: paneId,
    name: `${paneName} Selected Categories`,
    type: "category",
    value: {
      oneOf: [],
      notOneOf: []
    }
  }]

  return variables
}
