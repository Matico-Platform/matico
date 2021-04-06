import React, { useState } from 'react';
import {
    LayerStyle,
    Layer,
    Dataset,
    DefaultPolyonStyle,
    DefaultPointStyle,
    DefaultLineStyle,
    DatasetSource,
} from '../../api';
import { useDatasets } from '../../Hooks/useDatasets';
import Select from 'react-dropdown-select';
import { Form } from '../Forms/Forms';
import { Styles } from './AddLayerModalStyles';
import { Button, ButtonType } from '../Button/Button';

import { useForm } from 'react-hook-form';

interface AddLayerModalProps {
    onDone: (layer: Layer) => void;
    onDismiss: () => void;
}

interface LayerSelection {
    label: string;
    default: LayerStyle;
}

export const AddLayerModal: React.FC<AddLayerModalProps> = ({
    onDismiss,
    onDone,
}) => {
    const { datasets } = useDatasets();
    const { register, handleSubmit, errors } = useForm();
    const [
        selectedDataset,
        setSelectedDataset,
    ] = useState<Dataset | null>(null);
    const [
        selectedLayerType,
        setSelectedLayerType,
    ] = useState<LayerSelection | null>(null);

    const selectLayerType = (value: LayerSelection[]) => {
        if (value.length > 0) {
            setSelectedLayerType(value[0]);
        }
    };

    const selectDataset = (value: Dataset[]) => {
        if (value.length > 0) {
            setSelectedDataset(value[0]);
        }
    };

    const LayerTypes = [
        {
            label: 'Polygon',
            default: { Polygon: DefaultPolyonStyle },
        },
        { label: 'Point', default: { Point: DefaultPointStyle } },
        { label: 'Line', default: { Line: DefaultLineStyle } },
    ];

    const attemptCreateLayer = (newLayer: any) => {
        if (selectedDataset && selectedLayerType) {
            const layerSource: DatasetSource = {
                Dataset: selectedDataset.id,
            };
            const layer: Layer = {
                source: layerSource,
                style: selectedLayerType.default,
                name: newLayer.name,
                description: newLayer.description,
            };
            onDone(layer);
            dismiss();
        }
    };
    const dismiss = () => {
        onDismiss();
    };
    const datasetValues = selectedDataset ? [selectedDataset] : [];
    const layerTypeValues = selectedLayerType
        ? [selectedLayerType]
        : [];
    return (
        <Styles.AddLayerModal>
            <Form onSubmit={handleSubmit(attemptCreateLayer)}>
                <label>Name</label>
                <input
                    type="text"
                    ref={register({ required: true })}
                    name="name"
                />
                {errors.name && errors.name.type === 'required' && (
                    <p className="errorMsg">Name is required.</p>
                )}
                <label>Description</label>
                <textarea
                    name="description"
                    ref={register({ required: true })}
                />
                {errors.description &&
                    errors.description.type === 'required' && (
                        <p className="errorMsg">
                            Description is required.
                        </p>
                    )}

                <label>Source</label>
                <Select
                    onChange={selectDataset}
                    values={datasetValues}
                    options={datasets}
                    valueField={'id'}
                    labelField={'name'}
                />

                <label>Type</label>
                <Select
                    onChange={selectLayerType}
                    values={layerTypeValues}
                    options={LayerTypes}
                    valueField={'label'}
                    labelField={'label'}
                />

                <Button type="submit" kind={ButtonType.Primary}>
                    Create
                </Button>
                <Button onClick={dismiss} kind={ButtonType.Secondary}>
                    Cancel
                </Button>
            </Form>
        </Styles.AddLayerModal>
    );
};
