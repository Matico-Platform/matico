import React, { useEffect } from "react";
import { MaticoPaneInterface } from "../Pane";
import { useAutoVariable } from "../../../Hooks/useAutoVariable";
import { Filter } from "@maticoapp/matico_types/spec";
import { useMaticoSelector } from "../../../Hooks/redux";
import { useRequestColumnStat } from "Hooks/useRequestColumnStat";
import {
    DateRangePicker,
    Flex,
    RangeSlider,
    View
} from "@adobe/react-spectrum";
import { useErrorsFor } from "Hooks/useErrors";
import { MaticoErrorType } from "Stores/MaticoErrorSlice";
import { LoadingSpinner } from "Components/MaticoEditor/EditorComponents/LoadingSpinner/LoadingSpinner";
import { v4 as uuid } from "uuid";
import { MissingParamsPlaceholder } from "../MissingParamsPlaceholder/MissingParamsPlaceholder";
import { CalendarDate, parseDate } from "@internationalized/date";

export interface MaticoDateTimeSliderInterface extends MaticoPaneInterface {
    dataset: { name: string; filters: Array<Filter> };
    column: string;
    id: string;
}

const backgroundColor = "#fff";

export const MaticoDateTimeSlider: React.FC<MaticoDateTimeSliderInterface> = ({
    dataset,
    column = "",
    id
}) => {
    const [range, setRange] = useAutoVariable({
        variable: {
            id: id + "_date_range",
            paneId: id,
            name: `${column}_date_range`,
            value: {
                type: "dateRange",
                value: "NoSelection"
            }
        },
        bind: true
    });

    const { errors, throwError, clearErrors } = useErrorsFor(
        id,
        MaticoErrorType.PaneError
    );
    const paramsAreNull = !dataset?.name || !column?.length;

    const foundDataset = useMaticoSelector(
        (state) => state.datasets.datasets[dataset.name]
    );

    const datasetReady = foundDataset && foundDataset.state === "READY";

    const extentRequest = foundDataset
        ? {
              datasetName: dataset.name,
              column,
              metric: "extent",
              filters: dataset.filters,
              parameters: {}
          }
        : null;

    const setRangeValue = (value: { min: Date; max: Date }) => {
        setRange({ type: "dateRange", value });
    };
    const extentResult = useRequestColumnStat(extentRequest);

    const extent = extentResult?.result;

    const extentDate = extent
        ? { min: new Date(extent.min), max: new Date(extent.max) }
        : null;

    useEffect(() => {
        if (extentDate && range.value === "NoSelection") {
            setRangeValue(extentDate);
        }
    }, [JSON.stringify(extentDate), range?.value]);

    return (
        <View
            width="100%"
            height="100%"
            position="relative"
            backgroundColor={"gray-200"}
        >
            {!!paramsAreNull ? (
                <MissingParamsPlaceholder paneName="Histogram" />
            ) : !datasetReady || !extent  || !range?.value || range.value==='NoSelection' ? (
                <div>{dataset.name} not found!</div>
            ) : (
                <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="space-around"
                    width="100%"
                    height="100%"
                >
                    <Flex
                        direction="row"
                        alignItems="center"
                        flex={1}
                        gap={"size-200"}
                        width={'80%'}
                        justifyContent={'space-around'}
                    >
                        <RangeSlider
                            flex={1}
                            maxValue={extent.max}
                            minValue={extent.min}
                            showValueLabel={false}
                            value={{
                                start: range.value.min.getTime(),
                                end: range.value.max.getTime()
                            }}
                            onChange={(val) =>
                                setRangeValue({
                                    min: new Date(val.start),
                                    max: new Date(val.end)
                                })
                            }
                        />
                        <DateRangePicker
                            maxValue={
                                new CalendarDate(
                                    extentDate.max.getUTCFullYear(),
                                    extentDate.max.getUTCMonth(),
                                    extentDate.max.getUTCDate()
                                )
                            }
                            minValue={
                                new CalendarDate(
                                    extentDate.min.getUTCFullYear(),
                                    extentDate.min.getUTCMonth(),
                                    extentDate.min.getUTCDate()
                                )
                            }
                            granularity="day"
                            onChange={(newRange) => {
                                setRangeValue({
                                    min: new Date(
                                        newRange.start.year,
                                        newRange.start.month,
                                        newRange.start.day
                                    ),
                                    max: new Date(
                                        newRange.end.year,
                                        newRange.end.month,
                                        newRange.end.day
                                    )
                                });
                            }}
                            value={{
                                start: new CalendarDate(
                                    range.value.min.getUTCFullYear(),
                                    range.value.min.getUTCMonth(),
                                    range.value.min.getUTCDate()
                                ),
                                end: new CalendarDate(
                                    range.value.max.getUTCFullYear(),
                                    range.value.max.getUTCMonth(),
                                    range.value.max.getUTCDate()
                                )
                            }}
                        />
                        {}
                    </Flex>
                </Flex>
            )}
        </View>
    );
};
