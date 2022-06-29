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

interface ColorPickerDialogInterface {
    // label: string;
    color: string | [number, number, number, number];
    onColorChange: (color: string | [number, number, number, number]) => void;
    height?: string;
    width?: string;
}

export const ColorPickerDialog: React.FC<ColorPickerDialogInterface> = ({
    color,
    onColorChange,
    height = "size-400",
    width = "size-600"
}) => {
    let chromaColor;

    if (Array.isArray(color)) {
        if (color.length === 4) {
            chromaColor = chroma([...color.slice(0, 3), color[3] / 255]);
        } else {
            chromaColor = chroma([...color]);
        }
    } else if (chroma.valid(color)) {
        chromaColor = chroma(color);
    } else {
        return <Text>Invalid Color</Text>;
    }

    let rgba = chromaColor.rgba();
    let spectrumColor = `rgba(${rgba.join(",")})`;

    const updateColor = (color: Color) => {
        const rgbaColor = color.toFormat("rgba");
        onColorChange([
            rgbaColor.red,
            rgbaColor.green,
            rgbaColor.blue,
            rgbaColor.alpha * 255
        ]);
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
                    <Text>Select Color</Text>
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
