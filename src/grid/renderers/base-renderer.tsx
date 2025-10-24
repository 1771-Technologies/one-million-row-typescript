import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";

export function BaseRenderer({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as number;

  return field ? `${field}` : "-";
}
