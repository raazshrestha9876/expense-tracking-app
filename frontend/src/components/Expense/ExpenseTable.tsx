import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Expense } from "@/redux/types/expense";
import { useGetExpensesApiQuery } from "@/redux/services/expenseApi";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/redux/store/store";
import { getExpenses } from "@/redux/slices/expenseSlice";

const getColumns = (
  onExpenseEditSheetOpen: (index: number) => void,
  openExpenseDeleteDialog: (index: number) => void,
  onExpenseDetailSheetOpen: (index: number) => void
): ColumnDef<Expense>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium ml-3">{row.getValue("description")}</p>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium ml-4">{row.getValue("category")}</p>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <p className="font-medium ml-4">{formatted}</p>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {method}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onExpenseEditSheetOpen(row.index)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExpenseDetailSheetOpen(row.index)}>
            <Eye className="mr-2 h-4 w-4" />
            View 
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openExpenseDeleteDialog(row.index)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface ExpenseTableProps {
  onExpenseEditSheetOpen: (index: number) => void;
  onExpenseDeleteDialogOpen: (index: number) => void;
  onExpenseDetailSheetOpen: (index: number) => void;
}

export function ExpenseTable({
  onExpenseEditSheetOpen,
  onExpenseDeleteDialogOpen,
  onExpenseDetailSheetOpen,
}: ExpenseTableProps) {

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const paginationRef = React.useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  let limit = 10;

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useGetExpensesApiQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (data?.expenses) {
      dispatch(getExpenses(data.expenses));
    }
  }, [data?.expenses, dispatch]);

  const table = useReactTable({
    data: data?.expenses ?? [],
    columns: getColumns(
      onExpenseEditSheetOpen,
      onExpenseDeleteDialogOpen,
      onExpenseDetailSheetOpen
    ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
  });

  const handlePrevious = () => {
    const isLastPageWithFewerExpense =
      data?.expenses && data?.expenses.length < limit;

    setPage((old) => {
      const newPage = Math.max(old - 1, 1);

      if (isLastPageWithFewerExpense) {
        setTimeout(() => {
          paginationRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }

      return newPage;
    });
  };

  const handleNext = () => {
    const totalPages = data?.totalPages ?? 1;
    setPage((old) => {
      const newPage = old + 1;
      if (newPage >= totalPages) {
        return old;
      } else {
        return newPage;
      }
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array(table.getRowCount())
                .fill(0)
                .map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {table.getAllColumns().map((column) => (
                      <TableCell key={`skeleton-cell-${rowIndex}-${column.id}`}>
                        <Skeleton className="h-4 w-full max-w-[150px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {data?.currentPage} of {data?.totalPages} | Total records:{" "}
          {data?.totalCounts}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={data ? page === data?.totalPages : true}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="h-0" ref={paginationRef} />
    </div>
  );
}
