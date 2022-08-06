import { Layout } from "@maticoapp/matico_types/spec";
import { MaticoFreeLayout } from "../Components/Layouts/MaticoFreeLayout/MaticoFreeLayout";
import { MaticoLinearLayout } from "Components/Layouts/MaticoLinearLayout/MaticoLinearLayout";
import { MaticoTabLayout } from "Components/Layouts/MaticoTabLayout/MaticoTabLayout";

interface LayoutLabel {
    name: string;
    label: string;
    default: Partial<Layout>;
}

export const availableLayouts: LayoutLabel[] = [
    {
        name: "free",
        label: "Free Layout",
        default: {
          allowOverflow : false
        }
    },
    {
        name: "linear",
        label: "Linear Layout",
        default: {
            direction: "vertical",
            justify: "flex-start",
            align: "center",
            allowOverflow:true
        }
    },
    {
        name: "tabs",
        label: "Tab Layout",
        default: {
          tabBarPosition:"horizontal"
        }
    }
];

export function selectLayout(layout: Layout) {
    switch (layout.type) {
        case "free":
            return MaticoFreeLayout;
        case "linear":
            return MaticoLinearLayout;
        case "tabs":
            return MaticoTabLayout;
        default:
            return null;
    }
}
