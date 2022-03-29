import { MaticoFreeLayout } from "../Components/Layouts/MaticoFreeLayout/MaticoFreeLayout";
import { MaticoLinearLayout } from "Components/Layouts/MaticoLinearLayout/MaticoLinearLayout";

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
