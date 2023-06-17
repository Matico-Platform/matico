import { Filter } from "@maticoapp/matico_types/spec";
import { nicelyFormatNumber } from "Panes/MaticoLegendPane/MaticoLegendPane";

export const generateFilterText = (f: Filter) => {
    switch (f.type) {
        case "noFilter":
            return "No filter";
        case "range": {
            if (f.variable) {
                const minText =
                    typeof f?.min === "object" && f?.min?.hasOwnProperty("var")
                        ? "𝑓.min"
                        : nicelyFormatNumber(f.min as number);

                const maxText =
                    typeof f?.max === "object" && f?.max?.hasOwnProperty("var")
                        ? "𝑓.max"
                        : nicelyFormatNumber(f.max as number);

                return `${f.variable || "Variable"
                    } between ${minText} & ${maxText}`;
            } else {
                return "Select a column to filter";
            }
        }
        case "date": {
            if (f.variable) {
                const minText = //@ts-ignore
                    typeof f?.min === "object" && f?.min?.hasOwnProperty("var")
                        ? "𝑓.min"
                        : new Date(f.min).toISOString().slice(0, 10);

                const maxText = //@ts-ignore
                    typeof f?.max === "object" && f?.max?.hasOwnProperty("var")
                        ? "𝑓.max"
                        : new Date(f.max).toISOString().slice(0, 10);

                return `${f.variable || "Variable"
                    } between ${minText} & ${maxText}`;
            } else {
                return "Select a column to filter";
            }
        }
        case "category": {
            if (f.variable) {
                return `${f.variable} ${f?.isOneOf?.length > 0
                        ? `is one of ${f.isOneOf?.join(", ")}`
                        : ""
                    } ${f?.isNotOneOf?.length > 0
                        ? `is not one of ${f.isNotOneOf?.join(", ")}`
                        : ""
                    }`;
            } else {
                return "Select a column to filter";
            }
        }
    }
    return "Filter Text";
};
