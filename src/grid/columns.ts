import type { Column } from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "./types";
import { Status } from "./renderers/status";
import { VoteAverage } from "./renderers/vote-average";
import { ReleaseDate } from "./renderers/release-date";
import { Dollar } from "./renderers/dollar";
import { Runtime } from "./renderers/runtime";
import { BackdropPath } from "./renderers/backdrop-path";
import { OriginalLanguage } from "./renderers/flags";
import { Overview } from "./renderers/overview";
import { Popularity } from "./renderers/popularity";

export const columns: Column<Movie>[] = [
  {
    id: "backdrop_path",
    name: "",
    width: 40,
    widthMin: 40,
    widthMax: 40,
    cellRenderer: BackdropPath,
    pin: "start",
  },
  { id: "title", name: "Title", width: 400 },
  {
    id: "vote_average",
    name: "Vote Average",
    type: "number",
    cellRenderer: VoteAverage,
    width: 160,
    widthMin: 160,
    uiHints: {
      resizable: true,
      movable: true,
      aggsAllowed: ["sum", "avg", "min", "max", "count"],
    },
  },
  {
    id: "status",
    name: "Status",
    cellRenderer: Status,
    width: 140,
    widthMin: 140,
    uiHints: {
      rowGroupable: true,
    },
  },
  {
    id: "release_date",
    name: "Release Date",
    type: "date",
    cellRenderer: ReleaseDate,
    width: 140,
    widthMin: 140,
  },
  {
    id: "revenue",
    name: "Revenue",
    type: "number",
    cellRenderer: Dollar,
    width: 160,
    widthMin: 160,
    uiHints: {
      resizable: true,
      movable: true,
      aggsAllowed: ["sum", "avg", "min", "max", "count"],
    },
  },
  {
    id: "runtime",
    name: "Runtime",
    type: "number",
    cellRenderer: Runtime,
    width: 120,
    widthMin: 120,
    uiHints: {
      resizable: true,
      movable: true,
      aggsAllowed: ["sum", "avg", "min", "max", "count"],
    },
  },
  {
    id: "budget",
    name: "Budget",
    type: "number",
    cellRenderer: Dollar,
    width: 130,
    widthMin: 130,
    uiHints: {
      resizable: true,
      movable: true,
      aggsAllowed: ["sum", "avg", "min", "max", "count"],
    },
  },
  {
    id: "original_language",
    name: "Lang",
    cellRenderer: OriginalLanguage,
    width: 80,
    widthMin: 80,
    uiHints: {
      rowGroupable: true,
      movable: true,
      resizable: true,
    },
  },
  { id: "overview", name: "Overview", cellRenderer: Overview },
  {
    id: "popularity",
    name: "Popularity",
    type: "number",
    cellRenderer: Popularity,
    width: 140,
    widthMin: 140,
    uiHints: {
      resizable: true,
      movable: true,
      aggsAllowed: ["sum", "avg", "min", "max", "count"],
    },
  },
  {
    id: "genre",
    name: "Genre",
    uiHints: { rowGroupable: true, resizable: true, movable: true },
  },
  {
    id: "sub_genre",
    name: "Sub Genre",
    uiHints: { rowGroupable: true, resizable: true, movable: true },
  },
  {
    id: "production_company",
    name: "Production Company",
    uiHints: { rowGroupable: true, resizable: true, movable: true },
  },
  {
    id: "production_country",
    name: "Production Country",
    uiHints: { rowGroupable: true, resizable: true, movable: true },
  },
];
