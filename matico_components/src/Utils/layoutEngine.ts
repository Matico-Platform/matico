import { MaticoFreeLayout } from "../Components/Layouts/MaticoFreeLayout/MaticoFreeLayout";

export function selectLayout(layout_name: string) {
    switch (layout_name) {
        case "free":
            return MaticoFreeLayout;
        default:
            return null;
    }
}
