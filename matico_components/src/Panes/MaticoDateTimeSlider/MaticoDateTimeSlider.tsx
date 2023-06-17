import React, { useEffect } from "react";
import { Filter } from "@maticoapp/matico_types/spec";
import {
  DateRangePicker,
  Flex,
  RangeSlider,
  View
} from "@adobe/react-spectrum";
import { CalendarDate } from "@internationalized/date";

export interface MaticoDateTimeSliderInterface {
  minDate: CalendarDate,
  maxDate: CalendarDate,

  startDate: CalendarDate,
  endDate: CalendarDate,

  onDateRangeChanged: (value: { startDate: CalendarDate, endDate: CalendarDate }) => void,
}

const numberToCalanderDate = (date: number) => {
  const nativeDate = new Date(date)
  return new CalendarDate("UTC", nativeDate.getFullYear(), nativeDate.getMonth(), nativeDate.getDay())
}


export const MaticoDateTimeSlider: React.FC<MaticoDateTimeSliderInterface> = ({
  startDate,
  endDate,
  minDate,
  maxDate,
  onDateRangeChanged
}) => {

  return (
    <View
      width="100%"
      height="100%"
      position="relative"
      backgroundColor={"gray-200"}
      overflow="hidden"
    >
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
            minValue={minDate.toDate("UTC").getTime()}
            maxValue={maxDate.toDate("UTC").getTime()}
            showValueLabel={false}
            value={{ start: startDate.toDate("UTC").getTime(), end: endDate.toDate("UTC").getTime() }}
            aria-label="Date Range Slider"
            onChange={(val) =>
              onDateRangeChanged({
                startDate: numberToCalanderDate(val.start),
                endDate: numberToCalanderDate(val.end)
              })
            }
          />
          <DateRangePicker
            minValue={minDate}
            maxValue={maxDate}
            aria-label="Date Range Picker"
            granularity="day"
            onChange={(newRange) => {
              onDateRangeChanged({
                min: new CalendarDate(
                  newRange.start.year,
                  newRange.start.month,
                  newRange.start.day
                ),
                max: new CalendarDate(
                  newRange.end.year,
                  newRange.end.month,
                  newRange.end.day
                )
              });
            }}
            value={{ start: startDate, end: endDate }}
          />
          {}
        </Flex>
      </Flex>
    </View>
  );
};
