import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MaticoDateTimeSlider } from '../MaticoDateTimeSlider'
import { render } from "__tests__/helpers"
import { CalendarDate } from "@internationalized/date";


const minDate = new CalendarDate(2022, 1, 1)
const maxDate = new CalendarDate(2023, 1, 1)
const startDate = new CalendarDate(2023, 2, 1)
const endDate = new CalendarDate(2023, 2, 20)

describe("Matico Date Time Slider", () => {
  it("should render all it's parts", () => {

    render(
      <MaticoDateTimeSlider startDate={startDate} endDate={endDate} minDate={minDate} maxDate={maxDate} onDateRangeChanged={() => { }} />
    );

    // let leftSlider = screen.getByRole("slider")

  });
});
