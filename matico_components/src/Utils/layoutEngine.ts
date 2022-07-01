import { Layout } from "@maticoapp/matico_types/spec";
import { MaticoFreeLayout } from "../Components/Layouts/MaticoFreeLayout/MaticoFreeLayout";
import { MaticoLinearLayout } from "Components/Layouts/MaticoLinearLayout/MaticoLinearLayout";

interface LayoutLabel {
    name: string;
    label: string;
}

export const availableLayouts: LayoutLabel[] = [
    {
        name: "free",
        label: "Free Layout"
    },
    {
        name: "linear",
        label: "Linear Layout"
    }
];

export function selectLayout(layout: Layout) {
    switch (layout.type) {
        case "free":
            return MaticoFreeLayout;
        case "linear":
            return MaticoLinearLayout;
        default:
            return null;
    }
}
