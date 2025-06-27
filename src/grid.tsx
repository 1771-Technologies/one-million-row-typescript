import "@1771technologies/lytenyte-pro/grid.css";

import {
  useLyteNytePro,
  LyteNyteGrid,
  useServerDataSource,
} from "@1771technologies/lytenyte-pro";
import type { RowDataItem } from "./types";
import type {
  CellRendererParamsProReact,
  ColumnProReact,
} from "@1771technologies/lytenyte-pro/types";
import {
  createContext,
  useContext,
  useId,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Menu } from "@1771technologies/lytenyte-pro/menu";
import { Dialog } from "@1771technologies/lytenyte-pro/dialog";

// Context to manage department/division values per row.
type DepartmentLookup = Map<number, { department?: string; division?: string }>;

const context = createContext<
  [DepartmentLookup, Dispatch<SetStateAction<DepartmentLookup>>]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>(null as any);

// Column configuration for the data grid.
const columns: ColumnProReact<RowDataItem>[] = [
  {
    id: "edit",
    headerName: "",
    width: 24,
    widthMin: 24,
    cellRenderer: EditRenderer, // Renders the edit icon to open the row editor dialog
  },
  { id: "id", headerName: "ID" },
  { id: "birth_date", headerName: "Birth Date" },
  { id: "first_name", headerName: "First Name" },
  { id: "last_name", headerName: "Last Name" },
  { id: "gender", headerName: "Gender" },
  { id: "hire_date", headerName: "Hire Date" },
  {
    id: "department",
    headerName: "Department",
    width: 250,
    widthFlex: 1,
    cellRenderer: DepartmentCellRenderer,
  },
  {
    id: "division",
    headerName: "Division",
    width: 250,
    widthFlex: 1,
    cellRenderer: DivisionCellRenderer,
  },
];

export function Grid() {
  // Set up server-side data fetching in paginated blocks
  const ds = useServerDataSource<RowDataItem>({
    rowDataFetcher: async (p) => {
      const res = await fetch("/api/get-data", {
        method: "POST",
        body: JSON.stringify({
          blocks: p.requestBlocks,
          blockSize: p.blockSize,
          reqTime: p.reqTime,
        }),
      });
      const data = await res.json();
      return data;
    },
  });

  // Context state for managing department/division mappings
  const depContextValue = useState(() => new Map());

  const grid = useLyteNytePro({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    // Enables row selection; selected IDs available via grid state or API
    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",

    // Register an edit dialog frame for updating row fields
    dialogFrames: {
      editFrame: {
        component: ({ context, api }) => {
          const [loading, setLoading] = useState(false);
          if (!context) {
            queueMicrotask(api.dialogFrameClose);
            return;
          }
          const data = context.row.data as RowDataItem;

          return (
            <>
              <Dialog.Backdrop />
              <Dialog.Container
                className="h-full right-0 w-[320px]"
                style={{ left: "unset", transform: "unset", top: "0px" }}
              >
                <Dialog.Title className="sr-only">Edit menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Edit the selected row
                </Dialog.Description>

                <form
                  className="grid grid-cols-2 gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const formData = new FormData(e.currentTarget);
                    const jsonData = {
                      birth_date: formData.get("birth_date"),
                      first_name: formData.get("first_name"),
                      last_name: formData.get("last_name"),
                      gender: formData.get("gender"),
                      hire_date: formData.get("hire_date"),
                    };

                    await fetch("/api/update-row", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: data.id, ...jsonData }),
                    });

                    // Update row locally after server response
                    context.row.data = { id: data.id, ...jsonData };
                    api.rowRefresh();
                    api.dialogFrameClose();
                  }}
                >
                  {/* Form fields for editable fields */}
                  {(
                    [
                      ["birth_date", "Birth Date"],
                      ["first_name", "First Name"],
                      ["last_name", "Last Name"],
                      ["gender", "Gender"],
                      ["hire_date", "Hire Date"],
                    ] as const
                  ).map(([name, label]) => (
                    <div
                      key={name}
                      className="grid grid-cols-subgrid col-span-full gap-2"
                    >
                      <label>{label}</label>
                      <input
                        name={name}
                        defaultValue={data[name]}
                        type={name.includes("date") ? "date" : "text"}
                        className="border border-gray-300 bg-gray-100 px-1"
                      />
                    </div>
                  ))}

                  <button
                    className="text-start border w-fit px-8"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </form>
              </Dialog.Container>
            </>
          );
        },
      },
    },

    // Register menus for updating department and division fields
    menuFrames: {
      departmentMenu: {
        component: ({ context, api }) => {
          if (!context) {
            queueMicrotask(api.menuFrameClose);
            return;
          }
          return (
            <Menu.Positioner>
              <Menu.Container style={{ width: "var(--anchor-width)" }}>
                {["HR", "Finance", "Operations", "Trading"].map((dept) => (
                  <Menu.Item key={dept} onClick={() => context.set(dept)}>
                    {dept}
                  </Menu.Item>
                ))}
              </Menu.Container>
            </Menu.Positioner>
          );
        },
      },
      divisionMenu: {
        component: ({ context, api }) => {
          if (!context) {
            queueMicrotask(api.menuFrameClose);
            return;
          }
          return (
            <Menu.Positioner>
              <Menu.Container style={{ width: "var(--anchor-width)" }}>
                {[
                  "Trading Tech",
                  "Treasury",
                  "People Ops",
                  "Structured Derivatives",
                ].map((div) => (
                  <Menu.Item key={div} onClick={() => context.set(div)}>
                    {div}
                  </Menu.Item>
                ))}
              </Menu.Container>
            </Menu.Positioner>
          );
        },
      },
    },
  });

  return (
    <context.Provider value={depContextValue}>
      <div className="h-full w-full">
        <LyteNyteGrid grid={grid} />
      </div>
    </context.Provider>
  );
}

function DepartmentCellRenderer({
  api,
  row,
}: CellRendererParamsProReact<RowDataItem>) {
  const deps = useContext(context);
  if (!api.rowIsLeaf(row)) return null;
  const value = deps[0].get(row.data.id);

  return (
    <button
      className="h-full w-full text-nowrap flex items-center px-2 cursor-pointer hover:text-primary-500 justify-between"
      onClick={(ev) => {
        api.menuFrameOpen("departmentMenu", ev.currentTarget, {
          set: (s: string) => {
            deps[1]((prev) => {
              const next = new Map(prev);
              next.set(row.data.id, { department: s });
              return next;
            });
          },
        });
      }}
    >
      <span>{value?.department ?? "Click to set department"}</span>
      <CaretDown />
    </button>
  );
}

function DivisionCellRenderer({
  api,
  row,
}: CellRendererParamsProReact<RowDataItem>) {
  const deps = useContext(context);
  if (!api.rowIsLeaf(row)) return null;
  const value = deps[0].get(row.data.id);
  const isDisabled = !value?.department;

  if (isDisabled) {
    return (
      <div className="h-full w-full flex items-center px-2 text-gray-400">
        Set department first
      </div>
    );
  }

  return (
    <button
      className="h-full w-full text-nowrap flex items-center px-2 cursor-pointer hover:text-primary-500 justify-between"
      disabled={isDisabled}
      onClick={(ev) => {
        api.menuFrameOpen("divisionMenu", ev.currentTarget, {
          set: (s: string) => {
            deps[1]((prev) => {
              const next = new Map(prev);
              next.set(row.data.id, {
                ...next.get(row.data.id),
                division: s,
              });
              return next;
            });
          },
        });
      }}
    >
      <span>{value?.division ?? "Click to set division"}</span>
      <CaretDown />
    </button>
  );
}

function EditRenderer({ api, row }: CellRendererParamsProReact<RowDataItem>) {
  return (
    <button
      className="h-full w-full flex items-center justify-center"
      onClick={() =>
        api.dialogFrameOpen("editFrame", { row, rowIndex: row.rowIndex })
      }
    >
      <PencilIcon />
    </button>
  );
}

// Simple caret-down icon for dropdown indicators
function CaretDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
    </svg>
  );
}

// Pencil icon for the edit cell
function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z" />
    </svg>
  );
}
