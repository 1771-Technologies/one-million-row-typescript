import { serve } from "@hono/node-server";
import { Hono } from "hono";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type {
  AsyncDataRequestBlockProReact,
  AsyncDataResponseProReact,
  SortModelItemProReact,
} from "@1771technologies/lytenyte-pro/types";

const app = new Hono();

const db = await open({
  filename: "./employee-db.sqlite",
  driver: sqlite3.Database,
});

app.post("api/update-row", async (c) => {
  const body = await c.req.json();

  await db.all(`
      UPDATE employees
      SET
        birth_date = '${body.birth_date}',
        first_name = '${body.first_name}',
        last_name = '${body.last_name}',
        gender = '${body.gender}',
        hire_date = '${body.hire_date}'
      WHERE
        id = '${body.id}';
    `);

  return c.json({});
});

app.post("api/get-data", async (c) => {
  const body = (await c.req.json()) as {
    blocks: AsyncDataRequestBlockProReact[];
    blockSize: number;
    reqTime: number;
    sort: SortModelItemProReact[];
  };

  const modelItem = body.sort.at(0);

  const orderBy = modelItem
    ? `ORDER BY ${modelItem.columnId} ${
        modelItem.isDescending ? "DESC" : "ASC"
      }`
    : "";

  const countResult = await db.all(`SELECT COUNT(*) as cnt FROM employees`);
  const count = countResult[0].cnt as number;

  const resBlocks = body.blocks.map<
    Promise<AsyncDataResponseProReact["blocks"][number]>
  >(async (c) => {
    const rows = await db.all(`
        SELECT 
            id, 
            birth_date, 
            first_name, 
            last_name, 
            gender, 
            hire_date
        FROM
            employees
        ${orderBy}
        LIMIT ${c.blockStart}, ${body.blockSize}`);

    return {
      blockKey: c.blockKey,
      size: count,
      frame: {
        data: rows,
        ids: rows.map((c) => c.id),
        kinds: rows.map(() => 1),
        childCounts: rows.map(() => 0),
        pathKeys: rows.map(() => null),
      },
    };
  });

  const res = await Promise.all(resBlocks);

  const result: AsyncDataResponseProReact = {
    reqTime: body.reqTime,
    blocks: res,
    rootCount: count,
  };

  return c.json(result);
});

console.log("Server listening on http://localhost:8009");
serve({
  fetch: app.fetch,
  port: 8009,
});
