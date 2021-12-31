import React, { useEffect, useState } from 'react';
import { Button, ButtonType } from 'Components/Button/Button';
import { Styles } from './FeatureEditorStyles';

interface FeatureEditorProps {
    feature: any;
    editable?: boolean;
    onSave: (update: any) => void;
}
export const FeatureEditor: React.FC<FeatureEditorProps> = ({
    feature,
    editable = false,
    onSave,
}) => {
    const [editableFeature, setEditableFeature] = useState<
        any | null | undefined
    >(null);

    useEffect(() => {
        setEditableFeature(feature);
    }, [feature]);

    const dirty =
        JSON.stringify(editableFeature) !== JSON.stringify(feature);

    const save = () => {
        if (onSave) {
            onSave(save);
        }
    };

    const discard = () => {
        setEditableFeature({ ...feature });
    };

    const updateField = (variable: string) => {
        return (e: any) => {
            const newVal = e.target.value;
            setEditableFeature({
                ...editableFeature,
                [variable]: newVal,
            });
        };
    };
    
    if(!feature){
        return <h3>Select a feature to view and edit</h3>
    }

    return (
        <Styles.FeatureEditor>
            {Object.entries(
                editableFeature ? editableFeature : feature,
            ).map(([name, value]) => (
                <Styles.FormEntry key={name}>
                    <label>{name}</label>
                    {editable ? (
                        <input
                            type="text"
                            onChange={updateField(name)}
                            value={value as any}
                        />
                    ) : (
                        <p>value</p>
                    )}
                </Styles.FormEntry>
            ))}
            {dirty && (
                <Styles.Buttons>
                    <Button type="submit" onClick={save}>
                        Save
                    </Button>
                    <Button
                        onClick={discard}
                        kind={ButtonType.Secondary}
                        type="submit"
                    >
                        Discard
                    </Button>
                </Styles.Buttons>
            )}
        </Styles.FeatureEditor>
    );
};
