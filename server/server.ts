import {
  type Filter,
  type FilterCombinator,
  getViewSlice,
  type Movie,
  type ViewSlice,
} from "./view-slice.ts";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type {
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponseBranchItem,
  DataResponseLeafItem,
} from "@1771technologies/lytenyte-pro/types";

const app = new Hono();

app.post("/view-slice", async (c) => {
  const body = (await c.req.json()) as {
    model: DataRequestModel<Movie>;
    reqs: DataRequest[];
  };

  const model = body.model;

  const filters = Object.entries(model.filters)
    .map<Filter | FilterCombinator | null>(function handle([column, filter]):
      | Filter
      | FilterCombinator
      | null {
      // Function filters are not supported, not even sure how a function will be sent over the network
      if (filter.kind === "func") return null;

      // The UI will only ever send flat combinator.
      if (filter.kind === "combination") {
        return {
          kind: "combination",
          filters: filter.filters
            .map((c) => {
              return handle([column, c]);
            })
            .filter((x) => x != null),
          operator: filter.operator,
        };
      }

      if (filter.kind === "string") {
        return {
          kind: "string",
          column,
          operator: filter.operator,
          value: filter.value,
        };
      }
      if (filter.kind === "number") {
        return {
          kind: "number",
          column,
          operator: filter.operator,
          value: filter.value,
        };
      }
      if (filter.kind === "date") {
        return {
          kind: "date",
          column,
          operator: filter.operator,
          value: filter.value,
        };
      }

      return null;
    })
    .filter((x) => x != null);

  const responses = body.reqs.map((x) => {
    const view: ViewSlice = {
      start: x.start,
      end: x.end,
      aggregations: Object.fromEntries(
        Object.entries(model.aggregations).map((x) => [x[0], x[1].fn])
      ) as Record<string, string>,
      filters: filters,
      filtersIn: {},
      groupKeys: x.path,
      groups: model.groups as string[],
      sort: model.sorts.flatMap((x) => {
        if (x.columnId?.startsWith("lytenyte-group-column")) {
          return (model.groups as string[]).map((g) => ({
            column: g,
            dir: x.isDescending ? "desc" : "asc",
          }));
        }
        return {
          column: x.columnId!,
          dir: x.isDescending ? "desc" : "asc",
        };
      }),
    };

    const rows = getViewSlice(view);

    const isLeaf = x.path.length === model.groups.length;

    return {
      kind: "center",
      asOfTime: Date.now(),
      data: rows.rows.map<DataResponseLeafItem | DataResponseBranchItem>(
        (data, i) => {
          if (isLeaf) {
            return {
              kind: "leaf",
              data,
              id: `${x.path.join(" / ")}.${i + x.start}`,
            };
          }

          return {
            kind: "branch",
            childCount: (data as { child_count: number }).child_count,
            data,
            key: (data as { key: string }).key,
            id:
              `__ROOT__` +
              " / " +
              x.path.join(" / ") +
              "/" +
              (data as { key: string }).key,
          };
        }
      ),
      start: x.start,
      end: x.end,
      path: x.path,
      size: rows.count,
    } satisfies DataResponse;
  });

  return c.json(responses);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
