import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { MaticoState, MaticoDispatch } from "../Stores/MaticoStore";

export const useMaticoDispatch = () => useDispatch<MaticoDispatch>();
export const useMaticoSelector: TypedUseSelectorHook<MaticoState> = useSelector;
