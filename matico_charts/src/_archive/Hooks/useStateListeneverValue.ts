import { useEffect } from "react";
import { ChartStoreAndActions, useStore } from "../Store/maticoChartStore";

export function useStateValueListener<
    StateKey extends keyof ChartStoreAndActions
>(
    key: StateKey,
    updater: () => () => void,
    dependency: any[]
): ChartStoreAndActions[StateKey] {
    const value = useStore((state) => state[key]);
    useEffect(updater, dependency);
    return value;
}
