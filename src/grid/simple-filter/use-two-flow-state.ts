import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEvent } from "./use-event";

export function useTwoFlowState<T>(value: T) {
  const [state, setValue] = useState(() => ({ current: value }));

  const setState: Dispatch<SetStateAction<T>> = useEvent((p) => {
    // @ts-expect-error its fine
    if (typeof p === "function") setValue({ current: p(state.current) });
    else setValue({ current: p });
  });

  const prevState = useRef(value);
  const current = useMemo(() => {
    if (prevState.current != value) return value;

    return state.current;
  }, [state, value]);

  useEffect(() => {
    if (prevState.current === value) return;

    prevState.current = value;
    state.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [current, setState] as const;
}
