import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { ImageIcon } from "@radix-ui/react-icons";
import type { Movie } from "../types";
import Tooltip from "../../components/tooltip";

export function BackdropPath({ grid, row, column }: CellRendererParams<Movie>) {
  const field = grid.api.columnField(column, row) as string;

  // TODO
  if (grid.api.rowIsGroup(row)) return null;

  const url =
    typeof field === "string" && field.trim()
      ? `https://image.tmdb.org/t/p/w1280/${field}`
      : "";

  if (!url) return null;

  return (
    <Tooltip
      className="p-0"
      trigger={
        <button className="w-full h-ful flex items-center justify-center">
          <ImageIcon />
        </button>
      }
    >
      <img width={240} src={url} alt="The backdrop image path for the movie" />
    </Tooltip>
  );
}
