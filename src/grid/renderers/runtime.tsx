import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function Runtime({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as number;

  return typeof field === "number" ? formatter.format(field) + " min" : "-";
}
