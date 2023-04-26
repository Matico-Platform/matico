import { useEffect, useState } from "react";
import regression, { Result } from "regression";

export const useRegression = (
    data: Array<Record<string, number>> | null,
    xColumn: string,
    yColumn: string
) => {
    const [result, setResult] = useState<Result | null>(null);
    useEffect(() => {
        if (data === null) {
            setResult(null);
            return;
        }

        let regData = data.map((d) => [d[xColumn], d[yColumn]]);
        //@ts-ignore
        let reg = regression.linear(regData);
        setResult(reg);
    }, [data, xColumn, yColumn]);
    return result;
};
