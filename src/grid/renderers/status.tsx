import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";
import { tw } from "../../lib/tw";

export function Status({ grid, row, column }: CellRendererParams<Movie>) {
  const value = grid.api.columnField(column, row) as string;

  if (grid.api.rowIsGroup(row)) {
    return "-";
  }

  return (
    <div className="flex items-center text-(--lng1771-gray-80) font-semibold tracking-wide text-xs">
      <div
        className={tw(
          "px-2 py-0.5 rounded",
          value === "Released" && "bg-primary-200 border border-primary-400",
          value === "Planned" &&
            "bg-emerald-300 border border-emerald-600 text-black",
          value === "In Production" && "bg-blue-300 text-black",
          value === "Post Production" && "bg-blue-500 text-black",
          (value == "Canceled" || value === "Rumored") &&
            "bg-amber-200 text-black border border-amber-500"
        )}
      >
        {value}
      </div>
    </div>
  );
}
