import type { SelectOption } from "./grid-select";

export const numberValueToLabel: Record<string, string> = {
  equals: "Equals",
  not_equals: "Not Equals",
  greater_than: "Greater Than",
  greater_than_or_equal: "Greater Than Or Equal To",
  less_than: "Less Than",
  less_than_or_equal: "Less Than Or Equal To",
};

export const numberOptions: SelectOption[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "greater_than_or_equal", label: "Greater Than Or Equal To" },
  { value: "less_than", label: "Less Than" },
  { value: "less_than_or_equal", label: "Less Than Or Equal To" },
];
export const textOptions: SelectOption[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "begins_with", label: "Begins With" },
  { value: "not_begins_with", label: "Does Not Begin With" },
  { value: "ends_with", label: "Ends With" },
  { value: "not_ends_with", label: "Does Not End With" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
];
export const textValueToLabel: Record<string, string> = {
  equals: "Equals",
  not_equals: "Not Equals",
  begins_with: "Begins With",
  not_begins_with: "Does Not Begin With",
  ends_with: "Ends With",
  not_ends_with: "Does Not End With",
  contains: "Contains",
  not_contains: "Does Not Contain",
};

export const dateOptions: SelectOption[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
];

export const dateValueToLabel: Record<string, string> = {
  equals: "Equals",
  not_equals: "Not Equals",
  before: "Before",
  after: "After",
};
