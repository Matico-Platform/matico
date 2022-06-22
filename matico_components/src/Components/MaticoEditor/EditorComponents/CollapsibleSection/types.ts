export type CollapsibleSectionProps = {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    titleClassName?: string;
}