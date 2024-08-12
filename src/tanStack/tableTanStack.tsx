import React, { useEffect, useState } from "react";
import {
  useReactTable,
  makeStateUpdater,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  flexRender,
  TableFeature,
  Table,
  RowData,
  OnChangeFn,
  ColumnDef,
  Column,
  Updater,
  functionalUpdate,
} from "@tanstack/react-table";

import { Tickets } from "@/lib/types";
import { getTickets } from "@/components/api/dashboardApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { removeToken } from "@/components/api/authApi";
import { pickupApi } from "@/components/api/pickupApi";

export type DensityState = "sm" | "md" | "lg";
export interface DensityTableState {
  density: DensityState;
}

export interface DensityOptions {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void;
  toggleDensity: (value?: DensityState) => void;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
  //merge our new feature's state with the existing table state
  interface TableState extends DensityTableState {}
  //merge our new feature's options with the existing table options
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions {}
  //merge our new feature's instance APIs with the existing table instance APIs
  interface Table<TData extends RowData> extends DensityInstance {}
  // if you need to add cell instance APIs...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // if you need to add row instance APIs...
  // interface Row<TData extends RowData> extends DensityRow
  // if you need to add column instance APIs...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // if you need to add header instance APIs...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // Note: declaration merging on `ColumnDef` is not possible because it is a type, not an interface.
  // But you can still use declaration merging on `ColumnDef.meta`
}

// end of TS setup!

// Here is all of the actual javascript code for our new feature
export const DensityFeature: TableFeature<any> = {
  // define the new feature's initial state
  getInitialState: (state): DensityTableState => {
    return {
      density: "md",
      ...state,
    };
  },

  // define the new feature's default options
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater("density", table),
    } as DensityOptions;
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } //use meta instead of directly adding to the columnDef to avoid typescript stuff that's hard to workaround
  // },

  // define the new feature's table instance methods
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onDensityChange?.(safeUpdater);
    };
    table.toggleDensity = (value) => {
      table.setDensity((old) => {
        if (value) return value;
        return old === "lg" ? "md" : old === "md" ? "sm" : "lg"; //cycle through the 3 options
      });
    };
  },

  // if you need to add row instance APIs...
  // createRow: <TData extends RowData>(row, table): void => {},
  // if you need to add cell instance APIs...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // if you need to add column instance APIs...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // if you need to add header instance APIs...
  // createHeader: <TData extends RowData>(header, table): void => {},
};
//end of custom feature code

//app code
function App() {
  const [pickupStatus, setPickupStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [data, _setData] = React.useState<Tickets[]>([]);
  const [density, setDensity] = React.useState<DensityState>("md");
  const [clicked, setClicked] = useState<{ [key: string]: boolean }>({});
const [Pick, setPick] = useState(false);
  const navigate = useNavigate();
  const columns = React.useMemo<ColumnDef<Tickets>[]>(
    () => [
      {
        accessorKey: "ticket_id",
        header: "Ticket ID",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_id",
        header: "Customer ID",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      //   {
      //     accessorKey: "customer_name",
      //     header: () => "Customer Name",
      //     footer: (props) => props.column.id,
      //   },
      {
        accessorKey: "type",
        header: () => <span>type</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "raised_at",
        header: "Profile Progress",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "title",
        header: "Title",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "description",
        header: "Description",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "severity",
        header: "Severity",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        footer: (props) => props.column.id,
      },
      //   {
      //     accessorKey: "data",
      //     header: "Data",
      //     footer: (props) => props.column.id,
      //   },
      //   {
      //     accessorKey: "raised_by_id",
      //     header: "Raise By ",
      //     footer: (props) => props.column.id,
      //   },
      {
        accessorKey: "bucket",
        header: "Bucket",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "canPick",
        header: "Can Pick",
        cell: (info) => {
          const ticketId = info.row.original.ticket_id;
          // return clicked[ticketId] ?  (
          //   <p className="bg-green-600 text-md p-2 rounded-md text-center">{pickupStatus[ticketId]}</p>
          // ) : (
          //   <Button
          //     className="p-2 bg-violet-600 hover:bg-yellow-400"
          //     onClick={() => handlePickup(ticketId)}
          //   >
          //     Pick up
          //   </Button>
          // );

          return Pick ? (
            <Button
              className="p-2 bg-violet-600 hover:bg-yellow-400"
              onClick={() => handlePickup(ticketId)}
            >
              Pick up
            </Button>
          ) : (
            <p className="bg-red-600 text-md p-2 rounded-md text-center">
              Cannot Assign Ticket
            </p>
          );
        },
        footer: (props) => props.column.id,
      },
      //   {
      //     accessorKey: "canAssign",
      //     header: "Can Assign",
      //     footer: (props) => props.column.id,
      //   },
      //   {
      //     accessorKey: "assignedToMe",
      //     header: "Assigne to me",
      //     footer: (props) => props.column.id,
      //   },
    ],
    [clicked, pickupStatus]
  );

  const table = useReactTable({
    _features: [DensityFeature], //pass our custom feature to the table to be instantiated upon creation
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      density, //passing the density state to the table, TS is still happy :)
    },
    onDensityChange: setDensity, //using the new onDensityChange option, TS is still happy :)
  });

  const handlePickup = async (id: string) => {
    console.log("clicked");

    try {
      const response = await pickupApi(id);

  
      setClicked((prev) => ({ ...prev, [id]: true }));
      setPickupStatus((prev) => ({ ...prev, [id]: response.data.msg }));
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        removeToken();
        alert("Session expired ! ,login again");
        navigate("/login");
      } else {
        alert("Something Went Wrong");
      }
    }
  };

  async function handleTicketsFetch() {
    try {
      const response = await getTickets();

      _setData(response.data.ticketId);
      console.log(data);
      
      console.log(response.data);

      response.data.ticketId.map((value,index) =>{
        if((value.canPick) === true){
          setPick(true);
        
          
        }
  
    });
  
        
        

    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        removeToken();
        alert("Session expired ! ,login again");
        navigate("/login");
      } else {
        alert("Something Went Wrong");
      }
    }
  }

  useEffect(() => {
    handleTicketsFetch();
  }, []);

  return (
    <div className="p-2">
      {/* <button
        onClick={() => table.toggleDensity()}
        className="border rounded p-1 bg-blue-500 text-white mb-2 w-64"
      >
        Toggle Density
      </button> */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="font-normal text-left border"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        //using our new feature
                        padding:
                          density === "sm"
                            ? "4px"
                            : density === "md"
                            ? "8px"
                            : "16px",
                        transition: "padding 0.2s",
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>

                      {header.column.getCanFilter() ? (
                        <div className="mt-1">
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr className=" hover:bg-violet-600" key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          //using our new feature
                          padding:
                            density === "sm"
                              ? "4px"
                              : density === "md"
                              ? "8px"
                              : "16px",
                          transition: "padding 0.2s",
                        }}
                        onClick={() => {
                          cell.column.id === "ticket_id" &&
                            navigate(`/idPage/${cell.getValue()}`);
                        }}
                        className="border cursor-pointer"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        {/* <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span> */}
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
      {/* <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
    />
  );
}

export default App;
