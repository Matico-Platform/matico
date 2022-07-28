import {clearAllErrors, clearErrorsForComponent, clearErrorsOfType, MaticoErrorType, registerError} from "Stores/MaticoErrorSlice";
import {useMaticoDispatch, useMaticoSelector} from "./redux";

export const useErrorsFor = (id: string, errorType: MaticoErrorType )=>{
  const dispatch = useMaticoDispatch();
  const errors = useMaticoSelector((state)=>state.errors.filter(err=>err.entityId==='id'))

  const throwError=(message:string)=>{
      dispatch(registerError({message, type: errorType, entityId:id})) 
  }

  const clearErrors = (id: string)=>{
    dispatch(clearErrorsForComponent(id))
  }

  return {errors, throwError, clearErrors}
}

export const useErrors = ()=>{
  
  const dispatch = useMaticoDispatch();
  const errors = useMaticoSelector((state)=>state.errors)

  const _clearAllErrors=()=>{
    dispatch(clearAllErrors())
  }

  return {errors, clearErrors: _clearAllErrors}
}

export const useErrorsOfType = (type: MaticoErrorType)=>{
  
  const dispatch = useMaticoDispatch();
  const errors = useMaticoSelector((state)=>state.errors.filter(err=>err.type===type))

  const throwError=({id,message} : {id: string, message:string})=>{
      dispatch(registerError({message, type, entityId:id})) 
  }

  const clearErrors=()=>{
    dispatch(clearErrorsOfType(type))
  }

  return {errors, clearErrors, throwError}
}
