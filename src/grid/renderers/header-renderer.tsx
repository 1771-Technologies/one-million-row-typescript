import { DropdownMenu as D } from "radix-ui";
import type {
  FilterModelItem,
  HeaderCellRendererParams,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import type { Movie } from "../types";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { tw } from "../../lib/tw";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../../components/popover";
import { FilterIcon, TickmarkIcon } from "@1771technologies/lytenyte-pro/icons";
import { SimpleFilterStringOrCombo } from "../simple-filter/simple-filter-string";
import { useTwoFlowState } from "../simple-filter/use-two-flow-state";
import {
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from "react";

export function HeaderRenderer({
  column,
  grid,
}: HeaderCellRendererParams<Movie>) {
  const sort = grid.state.sortModel
    .useValue()
    .find((c) => c.columnId === column.id);

  const isDescending = sort?.isDescending ?? false;

  const filterModel = grid.state.filterModel.useValue();
  const hasFilter = filterModel[column.id];

  const aggModel = grid.state.aggModel.useValue();
  const hasGroups = grid.state.rowGroupModel.useValue().length > 0;

  const aggFn = aggModel[column.id]?.fn;

  return (
    <div className="h-full w-full px-1 py-1">
      <div
        className={tw(
          "hover:bg-(--lng1771-gray-10) flex h-full w-full px-2 rounded-lg items-center text-xs transition-colors cursor-pointer gap-0.5 text-nowrap",
          (column.type === "number" || column.type === "date") &&
            "tabular-nums flex-row-reverse"
        )}
        onClick={() => {
          const current = grid.api.sortForColumn(column.id);

          if (current == null) {
            let sort: SortModelItem<Movie>;
            const columnId = column.id;

            if (column.type === "datetime") {
              sort = {
                columnId,
                sort: { kind: "date", options: { includeTime: true } },
              };
            } else if (column.type === "number") {
              sort = { columnId, sort: { kind: "number" } };
            } else {
              sort = { columnId, sort: { kind: "string" } };
            }

            grid.state.sortModel.set([sort]);
            return;
          }
          if (!current.sort.isDescending) {
            grid.state.sortModel.set([{ ...current.sort, isDescending: true }]);
          } else {
            grid.state.sortModel.set([]);
          }
        }}
      >
        {column.name ?? column.id}

        {aggFn && hasGroups && <AggMenu grid={grid} column={column} />}

        <Popover>
          <PopoverTrigger
            onClick={(e) => e.stopPropagation()}
            className={tw("relative")}
          >
            <FilterIcon />
            {hasFilter && (
              <div className="absolute top-0 right-0 size-1 bg-(--lng1771-primary-50) rounded-full" />
            )}
          </PopoverTrigger>
          <PopoverContent onClick={(e) => e.stopPropagation()}>
            <PopoverFilterContent grid={grid} column={column} />
          </PopoverContent>
        </Popover>

        {sort && (
          <span>
            {!isDescending ? (
              <ArrowUpIcon className="size-4" />
            ) : (
              <ArrowDownIcon className="size-4" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

function AggMenu({
  column,
  grid,
  className,
}: HeaderCellRendererParams<Movie> & { className?: string }) {
  const base = grid.state.columnBase.useValue();

  const aggs = grid.state.aggModel.useValue();
  const agg = aggs[column.id];
  const aggName = typeof agg?.fn === "string" ? agg?.fn : "Fn(x)";

  const options =
    column.uiHints?.aggsAllowed ?? base.uiHints?.aggsAllowed ?? [];

  return (
    <D.Root>
      <D.Trigger className={tw(className)} asChild>
        <button className="focus-visible:ring-(--lng1771-primary-50) rounded px-1 py-1 text-xs text-[var(--lng1771-primary-50)] hover:bg-[var(--lng1771-primary-30)] focus:outline-none focus-visible:ring-1">
          ({aggName as string})
        </button>
      </D.Trigger>
      <D.Portal>
        <GridDropMenuContent>
          <D.Arrow fill="var(--lng1771-gray-30)" />
          <D.DropdownMenuRadioGroup
            value={aggName}
            onValueChange={(c) => {
              grid.state.aggModel.set((prev) => {
                return { ...prev, [column.id]: { fn: c } };
              });
            }}
          >
            {options.map((c) => {
              return <RadioItem key={c} value={c} label={c} className="pl-1" />;
            })}
          </D.DropdownMenuRadioGroup>
        </GridDropMenuContent>
      </D.Portal>
    </D.Root>
  );
}
function GridDropMenuContent(props: PropsWithChildren) {
  return (
    <D.Content
      className={tw(
        "bg-(--lng1771-gray-05) border-(--lng1771-gray-30) z-50 rounded-lg border p-1"
      )}
    >
      {props.children}
    </D.Content>
  );
}
const itemCls =
  "flex items-center text-sm text-(--lng1771-gray-80) cursor-pointer rounded-lg  data-[highlighted]:bg-(--lng1771-gray-30) py-1 pr-2 px-0.5";

const RadioItem = ({
  icon,
  ...props
}: Omit<ComponentProps<typeof D.DropdownMenuRadioItem>, "children"> & {
  icon?: ReactNode;
  label: ReactNode;
}) => {
  return (
    <D.DropdownMenuRadioItem
      {...props}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={tw(
        props.className,
        itemCls,
        "group",
        "data-[disabled]:text-(--lng1771-gray-30)"
      )}
    >
      {icon && <MenuIcon>{icon}</MenuIcon>}
      {props.label}
      <MenuIcon>
        <TickmarkIcon
          className="stroke-(--lng1771-primary-50) relative hidden group-data-[state='checked']:block"
          style={{ right: -16 }}
        />
      </MenuIcon>
    </D.DropdownMenuRadioItem>
  );
};
const MenuIcon = (props: PropsWithChildren) => {
  return (
    <span className="text-(--lng1771-gray-70) mr-2 flex h-[24px] w-[20px] items-center justify-center">
      {props.children}
    </span>
  );
};

function PopoverFilterContent({
  grid,
  column,
}: HeaderCellRendererParams<Movie>) {
  const filterModel = grid.state.filterModel.useValue();

  const initialFilter = useMemo(() => {
    const filter = filterModel[column.id];

    if (!filter) return null;

    if (filter.kind === "combination") return filter;

    return {
      kind: "combination",
      filters: [filter],
      operator: "AND",
    };
  }, [filterModel, column]);

  const [tempFilter, setTempFilter] = useTwoFlowState<Partial<
    Partial<FilterModelItem<Movie>>
  > | null>((initialFilter as FilterModelItem<Movie>) ?? null);

  return (
    <div className="flex flex-col gap-2">
      <SimpleFilterStringOrCombo
        column={column}
        filter={tempFilter}
        setFilter={setTempFilter}
      />
      <div className="flex justify-end gap-2 py-2">
        <PopoverClose
          onClick={() => {
            grid.state.filterInModel.set((prev) => {
              const next = { ...prev };
              delete next[column.id];

              return next;
            });

            grid.state.filterModel.set((prev) => {
              const next = { ...prev };
              delete next[column.id];

              return next;
            });
          }}
          className={tw(
            "text-sm border border-(--lng1771-gray-30) px-3 rounded py-0.5 hover:bg-(--lng1771-gray-10) bg-(--lng1771-gray-00) text-(--lng1771-gray-70) cursor-pointer transition-colors"
          )}
        >
          Clear
        </PopoverClose>
        <PopoverClose
          onClick={() => {
            if (tempFilter) {
              let validFilter;
              if (
                tempFilter.kind === "number" ||
                tempFilter.kind === "date" ||
                tempFilter.kind === "string"
              ) {
                if (tempFilter.operator && tempFilter.value != null)
                  validFilter = tempFilter;
              } else if (tempFilter.kind === "combination") {
                const first = tempFilter.filters?.[0];
                const second = tempFilter.filters?.[1];
                const filters = [];
                if (
                  (first?.kind === "string" ||
                    first?.kind === "date" ||
                    first?.kind === "number") &&
                  first.operator &&
                  first.value != null
                )
                  filters.push(first);
                if (
                  (second?.kind === "string" ||
                    second?.kind === "date" ||
                    second?.kind === "number") &&
                  second.operator &&
                  second.value != null
                )
                  filters.push(second);

                if (filters.length === 1) {
                  validFilter = filters[0];
                } else if (filters.length === 2) {
                  validFilter = { ...tempFilter, filters };
                }
              }

              if (validFilter) {
                grid.state.filterModel.set((prev) => {
                  return {
                    ...prev,
                    [column.id]: validFilter,
                  };
                });
              }
            }
          }}
          style={{ transform: "scale(0.92)" }}
          className={tw(
            "text-sm  border border-(--lng1771-primary-30) px-3 rounded py-0.5 hover:bg-(--lng1771-primary-70) bg-(--lng1771-primary-50) text-(--lng1771-gray-02) font-semibold cursor-pointer transition-colors"
          )}
        >
          Apply
        </PopoverClose>
      </div>
    </div>
  );
}
