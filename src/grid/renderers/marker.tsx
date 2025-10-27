import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";

export function MarketRenderer(props: CellRendererParams<Movie>) {
  return (
    <div className="bg-(--lng1771-gray-10) w-full h-full flex items-center text-nowrap justify-center">
      {props.rowIndex}
    </div>
  );
}
