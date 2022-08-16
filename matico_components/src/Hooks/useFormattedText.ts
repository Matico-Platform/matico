import React, { useMemo } from "react";
import { useAutoVariables } from "./useAutoVariable";
import _ from "lodash";
const regexp = new RegExp("#{([^}]*)}", "g");

export const useFormattedText = (content: string) => {
    const requiredVariables = useMemo(() => {
        const matches = content.matchAll(regexp);
        const result = [];
        for (const match of matches) {
            let name = match[1].split(".")[0];
            let path = match[1].split(".").slice(1).join(".");
            result.push({
                name,
                path,
                match: match[0]
            });
        }
        return result;
    }, [content]);

    const autoVariables = useAutoVariables(
        requiredVariables.map((v) => ({ name: v.name }))
    );

    const formattedContent = useMemo(() => {
        return requiredVariables.reduce((agg, varDetails) => {
            let variable = autoVariables[varDetails.name];
            if (variable && "value" in variable) {
                let value = _.at(variable.value, varDetails.path)[0];
                if (value) {
                    agg = agg.replace(varDetails.match, `${value}`);
                } else {
                    agg = agg.replace(varDetails.match, `(variable undefined)`);
                }
                return agg;
            } else {
                agg = agg.replace(varDetails.match, `(varaible undefined)`);
            }
            return agg;
        }, content);
    }, [
        content,
        JSON.stringify(requiredVariables),
        JSON.stringify(autoVariables)
    ]);

    return [
        formattedContent
    ]
};
