import { useState } from "react";
import { MillionRowGrid } from "./grid";

export function GridLoader() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <MillionRowGrid
      key={resetKey}
      onReset={() => setResetKey((prev) => prev + 1)}
    />
  );
}
