import colorbrewer from 'colorbrewer';

export const getColors = (palette: string, reversed: boolean) => {
    const colors =
        //@ts-ignore
        colorbrewer[palette][8];

    const orderedColors = reversed
        ? colors.slice(0).reverse()
        : colors;
    return orderedColors;
};
