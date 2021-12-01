import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useAppSpec= ()=>{
  return  useMaticoSelector(state=>state.spec.spec)
}
