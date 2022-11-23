import {
    ActionButton,
    Button,
    Flex,
    TextField,
    View
} from "@adobe/react-spectrum";
import AddCircle from "@spectrum-icons/workflow/AddCircle";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Remove from "@spectrum-icons/workflow/Remove";
import Cancel from "@spectrum-icons/workflow/Cancel";
import React, { useRef } from "react";
import { BorderColorValue, Responsive } from "@react-types/shared";

interface EditablePillButtonProps {
    value: string | number;
    onEdit: (value: string) => void;
    onDelete: () => void;
    pillColor?: Responsive<BorderColorValue>;
}

export const EditablePillButton: React.FC<EditablePillButtonProps> = ({
    value,
    onEdit,
    onDelete,
    pillColor = "positive"
}) => {
    const [editing, setEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(`${value}`);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleDelete = () => {
        onDelete();
    };

    const handleSave = () => {
        onEdit(inputValue);
        setEditing(false);
    };

    const handleCancel = () => {
        setInputValue(`${value}`);
        setEditing(false);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <View borderRadius={"small"} borderColor={pillColor} borderWidth="thin">
            <Flex direction="row" alignItems="center" justifyContent="center">
                {editing ? (
                    <>
                        <TextField
                            value={inputValue}
                            onChange={setInputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                            }}
                            onBlur={handleCancel}
                            autoFocus
                        />
                        <ActionButton
                            isQuiet
                            aria-label="Add current text as category filter"
                            onPress={handleSave}
                        >
                            <Checkmark />
                        </ActionButton>

                        <ActionButton
                            isQuiet
                            aria-label="Cancel edits"
                            onPress={handleCancel}
                        >
                            <Cancel />
                        </ActionButton>
                    </>
                ) : (
                    <>
                        <Button
                            isQuiet
                            onPress={handleEdit}
                            variant="overBackground"
                            aria-albel={`Edit ${value} filter value`}
                            UNSAFE_style={{
                                borderRadius: 0
                            }}
                        >
                            {value}
                        </Button>
                        <ActionButton
                            isQuiet
                            aria-label="Remove this category filter"
                            onPress={handleDelete}
                        >
                            <Remove />
                        </ActionButton>
                    </>
                )}
            </Flex>
        </View>
    );
};

// Note to future self, WILD
// given the interface (minus pillColor, addded later) copilot wrote this component:
/**
 * 

export const EditablePillButton: React.FC<EditablePillButtonProps> = ({
    value,
    onEdit,
    onDelete,
}) => {
    const [editing, setEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleDelete = () => {
        onDelete();
    };

    const handleSave = () => {
        onEdit(inputValue);
        setEditing(false);
    };

    const handleCancel = () => {
        setInputValue(value);
        setEditing(false);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            {editing ? (
                <div>
                    <input value={inputValue} onChange={handleInput} />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            ) : (
                <div>
                    <span>{value}</span>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

 */
