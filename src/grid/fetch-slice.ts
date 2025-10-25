import type {
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponsePinned,
} from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "./types";

export async function fetchSlice(req: {
  model: DataRequestModel<Movie>;
  reqs: DataRequest[];
}): Promise<(DataResponse | DataResponsePinned)[]> {
  return await fetch("/api/view-slice", {
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((res) => res.json());
}
