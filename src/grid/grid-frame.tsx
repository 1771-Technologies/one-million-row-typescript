import { type PropsWithChildren, type ReactNode } from "react";
import { tw } from "../lib/tw";
import { RefreshIcon } from "@1771technologies/lytenyte-pro/icons";

export function GridFrame(
  props: PropsWithChildren<{
    title: string;
    headerChildren: ReactNode;
    onReset: () => void;
  }>
) {
  return (
    <div className={tw("lng-grid h-full w-full bg-{--lng1771-gray-00)")}>
      <div className="flex flex-col h-full w-full">
        <div>
          <div className="flex items-center gap-2 py-4 px-4">
            <h2 className="flex-1 text-[var(--lng1771-gray-80)] font-[500]">
              {props.title}
            </h2>
            <div className="flex-1" />
            <button
              onClick={() => props.onReset()}
              className="flex items-center px-4 h-[44px] gap-2 border-(--lng1771-gray-30) border rounded-lg bg-white dark:bg-(--lng1771-gray-05) text-black dark:text-(--lng1771-gray-80) font-semibold"
            >
              <RefreshIcon /> Reset
            </button>
          </div>
          <div className="relative h-px bg-{--lng1771-gray-10) flex items-center justify-center"></div>
          {props.headerChildren}
        </div>
        <div className="flex-1 relative">
          <div className="absolute w-full h-full border-t border-t-(--lng1771-gray-10)">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
