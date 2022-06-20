import { BackgroundColorValue } from "@react-types/shared";

export type GatedActionProps = {
    buttonText: string;
    confirmText: string;
    confirmButtonText: string;
    onConfirm: () => void;
    confirmBackgroundColor?: BackgroundColorValue;
    children?: React.ReactNode;
};
