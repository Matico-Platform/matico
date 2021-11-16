import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {VariableState, VariableDispatch} from '../Stores/MaticoStateStore'

export const useVariableDispatch = ()=> useDispatch<VariableDispatch>()
export const useVariableSelector : TypedUseSelectorHook<VariableState> = useSelector
