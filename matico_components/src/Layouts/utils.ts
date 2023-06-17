/**
 * If the unit is Percent, return %, otherwise return px.
 * @param {string} unit - The unit of the value.
 */
export const handleUnits = (unit: string) => (unit === "percent" ? "%" : "px");

