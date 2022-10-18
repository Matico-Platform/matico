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

const PLACEHOLDER_TIME = {
    start: new Date(0).getTime(),
    end: new Date().getTime()
};

const PLACEHOLDER_DATE = {
    start: new CalendarDate(2000, 1, 1),
    end: new CalendarDate(2020, 1, 1)
};

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
    const rangeIsValid = range?.value?.min && !isNaN(range.value.min.getTime());

    const rangeTime = rangeIsValid
        ? {
              start: range.value.min.getTime(),
              end: range.value.max.getTime()
          }
        : PLACEHOLDER_TIME;

    const rangeDate = rangeIsValid
        ? {
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
          }
        : PLACEHOLDER_DATE;

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

    const startDate =
        typeof extent?.min !== "bigint" && !isNaN(+extent?.min)
            ? extent.min
            : null;
    const endDate =
        typeof extent?.max !== "bigint" && !isNaN(+extent?.max)
            ? extent.max
            : null;
    const minDate = startDate ? new Date(startDate) : null;
    const maxDate = endDate ? new Date(endDate) : null;
    const extentIsValid =
        minDate &&
        maxDate &&
        !isNaN(minDate.getTime()) &&
        !isNaN(maxDate.getTime());

    const extentDate =
        extentIsValid && minDate && maxDate
            ? { min: minDate, max: maxDate }
            : null;

    const minCalendarDate = extentDate
        ? new CalendarDate(
              extentDate.min.getUTCFullYear(),
              extentDate.min.getUTCMonth(),
              extentDate.min.getUTCDate()
          )
        : null;

    const maxCalendarDate = extentDate
        ? new CalendarDate(
              extentDate.max.getUTCFullYear(),
              extentDate.max.getUTCMonth(),
              extentDate.max.getUTCDate()
          )
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
            overflow="hidden"
        >
            {!!paramsAreNull ? (
                <MissingParamsPlaceholder paneName="Datetime slider" />
            ) : !datasetReady ||
              !extent ||
              !range?.value ||
              range.value === "NoSelection" ? (
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
                        width={"80%"}
                        justifyContent={"space-around"}
                    >
                        <RangeSlider
                            flex={1}
                            minValue={startDate}
                            maxValue={endDate}
                            showValueLabel={false}
                            value={rangeTime}
                            isDisabled={!rangeIsValid}
                            onChange={(val) =>
                                setRangeValue({
                                    min: new Date(val.start),
                                    max: new Date(val.end)
                                })
                            }
                        />
                        <DateRangePicker
                            minValue={minCalendarDate}
                            maxValue={maxCalendarDate}
                            granularity="day"
                            isDisabled={!rangeIsValid}
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
                            value={rangeDate}
                        />
                        {}
                    </Flex>
                </Flex>
            )}

            {!rangeIsValid && (
                <View
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    backgroundColor={"gray-50"}
                >
                    <Flex
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        Your date range is invalid. Please check your "Data Source" 
                        settings in the editor.
                    </Flex>
                </View>
            )}
        </View>
    );
};
