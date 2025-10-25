import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import { columns } from "./columns";
import { tw } from "../lib/tw";
import type { Movie } from "./types";
import { fetchSlice } from "./fetch-slice";
import { HeaderRenderer } from "./renderers/header-renderer";
import { GroupPills } from "./group-pill-manager";
import { BaseRenderer } from "./renderers/base-renderer";
import { GroupCellRenderer } from "./renderers/group-cell";

export function MillionRowGrid() {
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

    rowGroupColumn: {
      cellRenderer: GroupCellRenderer,
    },

    columnBase: {
      headerRenderer: HeaderRenderer,
      cellRenderer: BaseRenderer,
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const { header, rows } = grid.view.useValue();

  return (
    <div className="w-full h-full flex flex-col">
      <GroupPills grid={grid} />

      <div className="flex-1">
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

                      return <Grid.HeaderCell key={cell.id} cell={cell} />;
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
                                "justify-end tabular-nums"
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
      </div>
    </div>
  );
}
