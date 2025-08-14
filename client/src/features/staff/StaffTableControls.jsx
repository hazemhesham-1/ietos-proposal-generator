import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";

const StaffTableControls = ({ table }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center py-4">
            <Input
                value={(table.getColumn("email")?.getFilterValue()) ?? ""}
                onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
                className="bg-slate-100 max-w-sm"
                placeholder={t("common.placeholders.filterEmails")}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ms-auto">
                        {t("common.table.columns")}
                        <ChevronDownIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            className="capitalize"
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default StaffTableControls;