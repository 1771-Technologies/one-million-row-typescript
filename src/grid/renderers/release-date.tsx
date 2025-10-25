import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { format } from "date-fns";
import type { Movie } from "../types";

export function ReleaseDate({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as string;

  if (grid.api.rowIsGroup(row)) return "-";

  return typeof field === "string" && field.trim()
    ? format(field, "yyyy MMM dd")
    : "-";
}
