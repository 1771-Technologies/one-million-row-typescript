import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function Runtime({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as number;

  const aggModel = grid.state.aggModel.get();
  const showSign = aggModel[column.id]?.fn !== "count";

  const sign = showSign ? " min" : "";

  return typeof field === "number" ? formatter.format(field) + sign : "-";
}
