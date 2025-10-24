import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";
import Tooltip from "../../components/tooltip";

export function Overview({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row);

  if (grid.api.rowIsGroup(row)) return "-";

  if (typeof field !== "string" || !field.trim()) return "-";

  return (
    <Tooltip
      className="max-w-[20vw]"
      trigger={
        <button className="w-full h-ful flex items-center justify-center overflow-hidden text-ellipsis">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {field}
          </span>
        </button>
      }
    >
      {field}
    </Tooltip>
  );
}
