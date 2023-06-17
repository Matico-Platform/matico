import React, { useState, useEffect, useMemo } from "react";
import AceEditor from "react-ace";
import ace, { Ace } from "ace-builds";
import { useValidator } from "Hooks/useValidator";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import { useMaticoDispatch } from "Hooks/redux";
import { setSpec } from "Stores/MaticoSpecSlice";
import {
    Flex,
    Heading,
    ProgressCircle,
    Text,
    View,
    Well
} from "@adobe/react-spectrum";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";
import { useApp } from "Hooks/useApp";

export function json_error_to_annotation(error: string) {
    const rg = /(.*)at line (\d+) column (\d+)/;
    const parts = error.match(rg);
    if (parts) {
        return [
            {
                row: parseInt(parts[1]) - 1,
                column: parseInt(parts[2]) - 1,
                type: "error",
                text: parts[0]
            }
        ] as Ace.Annotation[];
    }
    return [] as Ace.Annotation[];
}

export const MaticoRawSpecEditor: React.FC = () => {
    const [code, setCode] = useState<string>();
    const [isValid, setIsValid] = useState<boolean>(true);
    const [jsonError, setJsonError] = useState<any | null>(null);
    const [validationResult, setValidationResult] = useState<any[] | null>(
        null
    );

    const { validator, validatorReady, error: validatorError } = useValidator();

    const { app } = useApp();
    const dispatch = useMaticoDispatch();

    //Need to figure out how to make sure this updates with other spec changes
    useEffect(() => {
        setCode(JSON.stringify(app, null, 2));
    }, []);

    const annotations: Ace.Annotation[] = jsonError
        ? json_error_to_annotation(jsonError)
        : [];

    useEffect(() => {
        if (validatorReady && validator.App) {
            try {
                const dash = validator.App.from_json(code);
                const { is_valid: specValid, errors } = dash.is_valid();
                if (specValid) {
                    dispatch(setSpec(dash.to_js()));
                    setIsValid(true);
                    setJsonError(null);
                    setValidationResult([]);
                } else {
                    setIsValid(false);
                    setValidationResult(errors);
                }
            } catch (e) {
                setIsValid(false);
                setJsonError(e);
            }
        }
    }, [JSON.stringify(code), validator, validatorReady]);

    const combinedErrors = useMemo(() => {
        let combinedErrors = [];
        if (jsonError) {
            combinedErrors.push(jsonError);
        }
        if (validationResult) {
            combinedErrors = combinedErrors.concat(validationResult);
        }
        return combinedErrors.filter((a) => a);
    }, [jsonError, validationResult]);

    if (validatorError) return <h1>Failed to load validator wasm </h1>;

    if (!validatorReady)
        return <ProgressCircle aria-label="Loading…" isIndeterminate />;
    return (
        <Flex
            direction="column"
            minHeight={{ L: "95vh", M: "95vh", S: "35vh", base: "35vh" }}
            height="auto"
            position="relative"
        >
            <Heading margin="size-150" alignSelf="start">
                Matico Specification
            </Heading>
            <AceEditor
                mode="json"
                theme="tomorrow_night"
                onChange={(changes: any) => setCode(changes)}
                value={code}
                fontSize={12}
                annotations={annotations}
                style={{
                    width: "100%",
                    height: "auto",
                    flex: 1
                }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                }}
            />
            {(!!jsonError || !!validationResult) && (
                <View
                    position="absolute"
                    bottom="5%"
                    left="20%"
                    width="60%"
                    backgroundColor="negative"
                >
                    {!!combinedErrors && !!combinedErrors.length && (
                        <ul>
                            {combinedErrors.map((err) => (
                                <li>
                                    <Text>{err}</Text>
                                </li>
                            ))}
                        </ul>
                    )}
                </View>
            )}
        </Flex>
    );
};
