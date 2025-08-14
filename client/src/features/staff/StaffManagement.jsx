import { useState } from "react";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import NavButtons from "@/components/NavButtons";
import StaffTableControls from "./StaffTableControls";
import StaffTable from "./StaffTable";

const data = [
    {
        id: "m5gr84i9",
        title: "Executive Manager",
        name: "Abdallah Fares",
        email: "a.fares@iwomt.com",
    },
    {
        id: "3u1reuv4",
        title: "Proposal Team Leader",
        name: "Nehad Ahmed",
        email: "nehad.ahmed@iwomt.com",
    },
    {
        id: "derv1ws0",
        title: "Team Leader",
        name: "Mohammed Khalil",
        email: "mohamed.khalil@iwomt.com",
    },
];

const columns = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown/>
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "title",
        header: () => <div className="text-start">Title</div>,
        cell: ({ row }) => <div className="font-semibold text-start">{row.getValue("title")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <EyeIcon/>
                        View employee
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];

const StaffManagement = () => {
    const [sorting, setSorting] = useState();
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection }
    });

    return (
        <div className="w-full">
            <StaffTableControls table={table}/>
            <div className="bg-slate-100 border rounded-md">
                <StaffTable table={table}/>
            </div>
            <NavButtons
                variant="outline"
                size="sm"
                onBackTo={() => table.previousPage()}
                onNextTo={() => table.nextPage()}
                backDisabled={!table.getCanPreviousPage()}
                nextDisabled={!table.getCanNextPage()}
            />
        </div>
    );
};

export default StaffManagement;