import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MaticoCategorySelector } from '../MaticoCategorySelectorPane'
import { render } from "__tests__/helpers"

describe('Maticocategory Selector', () => {
  it('should have no checkboxes when empty', () => {
    render(
      <MaticoCategorySelector categories={[]} selection={{ oneOf: [], notOneOf: [] }} name={"test"} onSelectionChanged={() => { }} />
    );
    const checkboxes = screen.queryAllByRole("checkbox");
    const selectAll = screen.getByText("Select All");
    const selectNone = screen.getByText("Select None");
    const searchFilter = screen.getByRole("searchbox");


    expect(selectAll).toBeVisible()
    expect(selectNone).toBeVisible()
    expect(searchFilter).toBeVisible()
    expect(checkboxes.length).toBe(0)
  });

  it('should have the correct number checkboxes when categories passed', () => {
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: [], notOneOf: [] }} name={"test"} onSelectionChanged={() => { }} />
    );
    const checkbox = screen.getAllByRole("checkbox");

    expect(checkbox.length).toBe(2)
  });

  it('should have the correct categories selected', () => {
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: ["two"], notOneOf: [] }} name={"test"} onSelectionChanged={() => { }} />
    )
    const checked = screen.getByDisplayValue("two");
    const unchecked = screen.getByDisplayValue("one");

    //@ts-ignore
    expect(checked.checked).toBe(true)
    //@ts-ignore
    expect(unchecked.checked).toBe(false)
  });

  it('on clicking an unselected category, should invoke the update function with that category selected', () => {
    const updateFunction = vi.fn((_: any) => { })
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: [], notOneOf: [] }} name={"test"} onSelectionChanged={updateFunction} />
    )
    const two = screen.getByDisplayValue("two");

    fireEvent.click(two)
    expect(updateFunction).toHaveBeenCalledWith({ oneOf: ["two"], notOneOf: [] })
  });

  it('on clicking a category, should invoke the update function with that category', () => {
    const updateFunction = vi.fn((_: any) => { })
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: ["one", "two"], notOneOf: [] }} name={"test"} onSelectionChanged={updateFunction} />
    )
    const one = screen.getByDisplayValue("one");

    fireEvent.click(one)
    expect(updateFunction).toHaveBeenCalledWith({ oneOf: ["two"], notOneOf: [] })
  });

  it('when clicking select all, should invoke the update function with all categories', () => {
    const updateFunction = vi.fn((_: any) => { })
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: [], notOneOf: [] }} name={"test"} onSelectionChanged={updateFunction} />
    )
    const selectAll = screen.getByText("Select All");

    fireEvent.click(selectAll)
    expect(updateFunction).toHaveBeenCalledWith({ oneOf: ["one", "two"], notOneOf: [] })
  });

  it('when clicking select none, should invoke the update function with no categories', () => {
    const updateFunction = vi.fn((_: any) => { })
    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: ["one"], notOneOf: [] }} name={"test"} onSelectionChanged={updateFunction} />
    )
    const selectNone = screen.getByText("Select None");

    fireEvent.click(selectNone)
    expect(updateFunction).toHaveBeenCalledWith({ oneOf: [], notOneOf: [] })

  });

  it('should filter displayed options when the filter is used', () => {

    render(
      <MaticoCategorySelector categories={[{ name: "one", count: 1 }, { name: "two", count: 10 }]} selection={{ oneOf: ["one"], notOneOf: [] }} name={"test"} onSelectionChanged={() => { }} />
    )
    const searchFilter = screen.getByRole("searchbox");

    fireEvent.change(searchFilter, { target: { value: 'on' } })

    const one = screen.queryByDisplayValue("one");
    const two = screen.queryByDisplayValue("two");

    expect(one).toBeInTheDocument()
    expect(two).not.toBeInTheDocument()
  });
});
