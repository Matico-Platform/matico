import React from 'react';
import { Styles } from './ProgressBarStyles';

type ProgressBarProps = {
    progress: number;
    progressColor?: string;
    doneColor?: string;
    errorColor?: string;
    showPC?: boolean;
};
export const ProgressBar: React.FC<ProgressBarProps> = ({
    showPC,
    progress,
    progressColor,
    doneColor,
    errorColor,
}) => {
    return (
        <Styles.ProgressBarOuter>
            <Styles.ProgressBarInner percent={progress} />
            {showPC && (
                <Styles.Percent>
                    {progress.toPrecision(2)}%
                </Styles.Percent>
            )}
        </Styles.ProgressBarOuter>
    );
};
