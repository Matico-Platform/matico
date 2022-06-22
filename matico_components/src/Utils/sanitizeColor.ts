export const sanitizeColor = (color: string | number[] | {[key:string]: any} | undefined) => {
    if (!color) return null;
    if (typeof color === "string") return color;
    if (Array.isArray(color)) {
        if (color.length === 3){
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        } else {
            return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] > 1 ? color[3] / 255 : color[3]})`;
        }
    }
    return null;
};
