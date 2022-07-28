import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {v4 as uuid} from 'uuid'

export interface MaticoError {
    id: string,
    type: MaticoErrorType;
    message: string;
    entityId?: string;
    createdAt: Date;
    seen: boolean
}

export enum MaticoErrorType {
    DatasetError = "DatasetError",
    PaneError = "PaneError",
    LayerError= "LayerError",
    LayoutError= "LayoutError"
}

export type ErrorState = Array<MaticoError>;

const initialState: ErrorState = [];

export type NewMaticoError= Omit<MaticoError,  "createdAt" | "seen" | "id">

const errorSlice = createSlice({
    name: "errors",
    initialState,
    reducers: {
        registerError: (
            state: ErrorState,
            action: PayloadAction<NewMaticoError>
        ) => {
            let error = {...action.payload, createdAt: new Date(), seen:false
            , id: uuid()};
            state.push(error);
        },
        errorViewed:(state: ErrorState, action: PayloadAction<string>)=>{
          let error = state.find(e=>e.id === action.payload)
          if (error){
            error.seen=true
          }
        },
        clearErrorsForComponent: (state:ErrorState, action: PayloadAction<string>)=>{
          let newErrors = state.filter(err=>err.entityId !== action.payload)
          state = newErrors
        },
        removeError:(state:ErrorState, action: PayloadAction<string>)=>{
          let newErrors = state.filter(err=>err.id !== action.payload)
          state= newErrors
        },
        clearAllErrors:(state:ErrorState) =>{
            state = [] 
        },
        clearErrorsOfType:(state:ErrorState, action: PayloadAction<MaticoErrorType>) =>{
            let newErrors = state.filter(err=>err.type !== action.payload);
            state= newErrors
        }
    }
});
export const {
    registerError,
    errorViewed,
    clearErrorsForComponent,
    removeError,
    clearAllErrors,
    clearErrorsOfType
} = errorSlice.actions;

export const errorReducer = errorSlice.reducer;
