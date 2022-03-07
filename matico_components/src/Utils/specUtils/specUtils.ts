export const EditTypeMapping = {
    pages: "Page",
    layers: "Layer",
    Map: "Map",
    sections: "Section",
    Text: "Text",
    Histogram: "Histogram",
    PieChart: "PieChart",
    Scatterplot: "Scatterplot",
    Controls: "Controls"
};

export const extractEditType = (path: string): string => {
    if (!path || !path.length) return null;
    const parts = [...path.split(".")].reverse();
    const lastPart = parts.find((f) => isNaN(+f));
    //@ts-ignore
    return EditTypeMapping[lastPart] || "";
};

export const getParentPath = (path: string): string => {
    if (!path?.length) {
        return path;
    }
    const parts = path.split(".");
    const reverseParts = [...parts].reverse();
    const lastPart = reverseParts.findIndex(
        (f, i) => isNaN(+f) && !isNaN(+reverseParts[i - 1])
    );
    //@ts-ignore
    return parts.slice(0, parts.length - lastPart).join(".");
};

export const getPathIndex = (path: string): number | null => {
    if (!path?.length) {
        return null;
    }
    const reverseParts = [...path.split(".")].reverse();
    const deepestArrayIndex = reverseParts.find(
        (f, i) => !isNaN(+f) && isNaN(+reverseParts[i + 1])
    );
    //@ts-ignore
    return +deepestArrayIndex;
};

export const incrementName = (name: string, takenNames: string[]): string => {
    //@ts-ignore
    let baseName = `${name}`;
    while (!isNaN(+baseName.slice(-1)[0]) && baseName.length > 0){
        baseName = baseName.slice(0, -1);
    }

    let tempName = `${baseName}`;
    let suffix = 0;
    
    do {
        tempName = `${baseName}${suffix}`;
        suffix++;
    } while (takenNames.includes(tempName));

    return tempName;
};
