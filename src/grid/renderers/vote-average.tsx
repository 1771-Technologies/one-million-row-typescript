import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function VoteAverage({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as number;

  return typeof field === "number" ? formatter.format(field) : "-";
}
