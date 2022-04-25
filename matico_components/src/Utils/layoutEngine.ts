import { MaticoFreeLayout } from "../Components/Layouts/MaticoFreeLayout/MaticoFreeLayout";
import { MaticoLinearLayout } from "Components/Layouts/MaticoLinearLayout/MaticoLinearLayout";

interface LayoutLabel {
    name: string;
    label: string;
}

export const availableLayouts: LayoutLabel[] = [
    {
        name: "free",
        label: "Free Layout",
    },
    {
        name: "linear",
        label: "Linear Layout",
    }
]

export function selectLayout(layout_name: string) {
    switch (layout_name) {
        case "free":
            return MaticoFreeLayout;
        case "linear":
            return MaticoLinearLayout;
        default:
            return null;
    }
}
