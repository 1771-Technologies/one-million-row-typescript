import parser from "csv-parser";
import Database from "better-sqlite3";
import z from "zod";
import fs from "fs";

const result = new Promise<unknown[]>((res) => {
  const stream = fs
    .createReadStream(`${import.meta.dirname}/movie_dataset.csv`)
    .pipe(parser());

  const results: unknown[][] = [];

  stream.on("data", (data) => {
    results.push({
      ...data,
      genre: data.genres.split(",").at(0)?.trim() ?? "",
      sub_genre: data.genres.split(",").at(1)?.trim() ?? "",
      production_company:
        data.production_companies.split(",").at(0)?.trim() ?? "",
      production_country:
        data.production_countries.split(",").at(0)?.trim() ?? "",
    });
  });
  stream.on("end", () => res(results));
});

const rawRows = await result;

const schema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  vote_average: z.coerce.number(),
  vote_count: z.coerce.number(),
  status: z.string(),
  release_date: z.string(),
  revenue: z.coerce.number(),
  runtime: z.coerce.number(),
  adult: z.string().transform((val) => {
    const x = val.trim().toLowerCase();
    return x === "true" ? 1 : 0;
  }),
  backdrop_path: z.string(),
  budget: z.coerce.number(),
  homepage: z.string(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.coerce.number(),
  poster_path: z.string(),
  tagline: z.string(),
  genre: z.string(),
  sub_genre: z.string(),
  production_company: z.string(),
  production_country: z.string(),
  spoken_languages: z.string(),
  keywords: z.string(),
});

const rows = rawRows.map((x) => {
  return { ...schema.parse(x), id: crypto.randomUUID() };
});

const db = new Database(`${import.meta.dirname}/movies.db`, {});
db.pragma("journal_mode = WAL");

// Drop the table
db.prepare("DROP TABLE IF EXISTS movies").run();

// Create the movies table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    vote_average REAL,
    vote_count REAL,
    status TEXT,
    release_date TEXT,
    revenue REAL,
    runtime REAL,
    adult REAL,
    backdrop_path TEXT,
    budget REAL,
    homepage TEXT,
    imdb_id TEXT,
    original_language TEXT,
    original_title TEXT,
    overview TEXT,
    popularity REAL,
    poster_path TEXT,
    tagline TEXT,
    genre TEXT,
    sub_genre TEXT,
    production_company TEXT,
    production_country TEXT,
    spoken_languages TEXT,
    keywords TEXT
  );
`
).run();

// Prepare the insert statement once
const insert = db.prepare(`
  INSERT INTO movies (
    id, title, vote_average, vote_count, status, release_date, revenue, runtime, adult,
    backdrop_path, budget, homepage, imdb_id, original_language, original_title,
    overview, popularity, poster_path, tagline, genre, sub_genre, production_company,
    production_country, spoken_languages, keywords
  ) VALUES (
    @id, @title, @vote_average, @vote_count, @status, @release_date, @revenue, @runtime, @adult,
    @backdrop_path, @budget, @homepage, @imdb_id, @original_language, @original_title,
    @overview, @popularity, @poster_path, @tagline, @genre, @sub_genre, @production_company,
    @production_country, @spoken_languages, @keywords
  );
`);

// Use a transaction for speed and atomicity
const insertMany = db.transaction((movies) => {
  let errorCount = 0;
  for (const m of movies) {
    try {
      insert.run(m);
    } catch {
      errorCount++;
    }
  }

  console.log(errorCount);
});

insertMany(rows);
