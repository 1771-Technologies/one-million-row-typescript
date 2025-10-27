import {
  Grid,
  measureText,
  useServerDataSource,
} from "@1771technologies/lytenyte-pro";
import { Mosaic } from "react-loading-indicators";
import { columns } from "./columns";
import { tw } from "../lib/tw";
import type { Movie } from "./types";
import { fetchSlice } from "./fetch-slice";
import { HeaderRenderer } from "./renderers/header-renderer";
import { GroupPills } from "./group-pill-manager";
import { BaseRenderer } from "./renderers/base-renderer";
import { GroupCellRenderer } from "./renderers/group-cell";
import { GridFrame } from "./grid-frame";
import { MarketRenderer } from "./renderers/marker";
import { useEffect } from "react";

export function MillionRowGrid({ onReset }: { onReset: () => void }) {
  const ds = useServerDataSource<Movie>({
    dataFetcher: async (req) => {
      const res = await fetchSlice({ model: req.model, reqs: req.requests });
      return res;
    },
    blockSize: 300,
  });

  const grid = Grid.useLyteNyte<Movie>({
    gridId: "grid",
    rowDataSource: ds,
    headerHeight: 38,
    rowHeight: 32,
    columns: columns,

    aggModel: {
      revenue: { fn: "sum" },
      runtime: { fn: "avg" },
      budget: { fn: "avg" },
      popularity: { fn: "avg" },
      vote_average: { fn: "avg" },
    },

    columnMarker: {
      cellRenderer: MarketRenderer,
    },
    columnMarkerEnabled: true,
    rowGroupColumn: {
      pin: "start",
      cellRenderer: GroupCellRenderer,
      uiHints: {
        resizable: true,
      },
    },

    columnBase: {
      headerRenderer: HeaderRenderer,
      cellRenderer: BaseRenderer,
      widthMin: 150,
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const { header, rows } = grid.view.useValue();

  const isLoading = ds.isLoading.useValue();

  useEffect(() => {
    return grid.state.viewBounds.watch(() => {
      const b = grid.state.viewBounds.get();
      const max = "9".repeat(`${b.rowCenterEnd}`.length);

      const width = Math.max(
        measureText(`${max}`, grid.state.viewport.get()!).width + 16,
        40
      );
      const currentWidth = grid.state.columnMarker.get().width! ?? 40;
      if (Math.abs(currentWidth - width) > 5) {
        grid.state.columnMarker.set((prev) => ({
          ...prev,
          minWidth: width,
          maxWidth: width,
          width,
        }));
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <GridFrame
        onReset={onReset}
        title="One Million Rows"
        headerChildren={<GroupPills grid={grid} />}
      >
        {isLoading && (
          <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col">
            <Mosaic color="#32cd32" size="medium" text="" textColor="" />
            Loading...
          </div>
        )}
        <Grid.Root grid={grid}>
          <Grid.Viewport
            id="grid"
            style={{ overflowY: "scroll", scrollbarWidth: "thin" }}
          >
            <Grid.Header>
              {header.layout.map((headerRow, index) => {
                return (
                  <Grid.HeaderRow key={index} headerRowIndex={index}>
                    {headerRow.map((cell) => {
                      if (cell.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={cell.id}
                          cell={cell}
                          className={tw(
                            cell.column.id === "lytenyte-marker-column" &&
                              "bg-(--lng1771-gray-10)!"
                          )}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row key={row.id} row={row}>
                      {row.cells.map((cell) => {
                        return (
                          <Grid.Cell
                            key={cell.id}
                            cell={cell}
                            className={tw(
                              "flex items-center px-2",
                              (cell.column.type === "number" ||
                                cell.column.type === "date") &&
                                "justify-end tabular-nums",
                              cell.column.id === "lytenyte-marker-column" &&
                                "px-0 font-mono"
                            )}
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </GridFrame>
    </div>
  );
}
