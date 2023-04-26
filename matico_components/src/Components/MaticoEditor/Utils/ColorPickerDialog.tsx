import React, { useState } from "react";
import {
    DialogTrigger,
    Dialog,
    ActionButton,
    Content,
    Flex,
    View,
    Text
} from "@adobe/react-spectrum";
import chroma from "chroma-js";
import { ColorSlider } from "@react-spectrum/color";
import ColorFill from "@spectrum-icons/workflow/ColorFill";
import { chromaColorFromColorSpecification } from "Components/Panes/MaticoMapPane/LayerUtils";
import { ColorSpecification } from "@maticoapp/matico_types/spec";

interface ColorPickerDialogInterface {
    // label: string;
    color: ColorSpecification;
    onColorChange: (color: ColorSpecification) => void;
    label?: string;
    height?: string;
    width?: string;
}

export const ColorPickerDialog: React.FC<ColorPickerDialogInterface> = ({
    color,
    onColorChange,
    height = "size-400",
    label = "Select Color",
    width = "size-600"
}) => {
    if (!color) return null;
    console.log("color is ", color);
    const hasAlpha = "rgba" in color;
    let chromaColor = chromaColorFromColorSpecification(color, hasAlpha);
    let rgba = hasAlpha ? chromaColor.rgba() : chromaColor.rgb();
    let spectrumColor = `rgb${hasAlpha ? "a" : ""}(${rgba.join(",")})`;

    const updateColor = (color: any) => {
        const rgbaColor = color.toFormat("rgba");
        onColorChange({
            rgba: [
                rgbaColor.red,
                rgbaColor.green,
                rgbaColor.blue,
                rgbaColor.alpha * 255
            ]
        });
    };

    return (
        <DialogTrigger type="popover">
            <View
                width={"100%"}
                height={height}
                UNSAFE_style={{ backgroundColor: spectrumColor }}
            >
                <ActionButton width="100%" height="100%" staticColor="white">
                    <ColorFill size="S" />
                    <Text>{label}</Text>
                </ActionButton>
            </View>
            {(close) => (
                <Dialog>
                    <Content>
                        <Flex direction="column">
                            <ColorSlider
                                width="100%"
                                channel="red"
                                value={spectrumColor}
                                onChange={updateColor}
                            />
                            <ColorSlider
                                width="100%"
                                channel="green"
                                value={spectrumColor}
                                onChange={updateColor}
                            />
                            <ColorSlider
                                width="100%"
                                channel="blue"
                                value={spectrumColor}
                                onChange={updateColor}
                            />
                            <ColorSlider
                                width="100%"
                                channel="alpha"
                                value={spectrumColor}
                                onChange={updateColor}
                            />
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
