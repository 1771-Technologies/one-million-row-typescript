/**
 * Our row data is based on the Yelp review dataset, which has about 1 million rows.
 * The data item itself is a tuple of the following items. We prefer a tuple over a
 * JSON structure to save on the bytes transferred from the server to the client.
 */
export type RowDataItem = {
  readonly id: number;
  readonly birth_date: string;
  readonly first_name: number;
  readonly last_name: string;
  readonly gender: string;
  readonly hire_date: string;
};
