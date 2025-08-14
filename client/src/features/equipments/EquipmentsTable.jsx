import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { capitalizeText, isValidJSON } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import EquipmentRowActions from "./EquipmentRowActions";

const EquipmentsTable = ({ equipments }) => {
    const { t } = useTranslation();
    const { watch } = useFormContext();
    const currencyValue = watch("currency");
    const currency = isValidJSON(currencyValue) ? JSON.parse(currencyValue) : null;

    const totalPrice = equipments.reduce((acc, { unit, price, quantity }) => unit !== "LS" ? (acc + (Number(price) * quantity)) : (acc + Number(price)), 0);

    return (
        <Table className="border border-border">
            <TableCaption>{t("common.table.equipmentList")}</TableCaption>
            <TableHeader className="bg-primary-200">
                <TableRow>
                    <TableHead className="w-25">#</TableHead>
                    <TableHead>{t("common.table.equipmentName")}</TableHead>
                    <TableHead>{t("dialog.labels.unit")}</TableHead>
                    <TableHead>{t("dialog.labels.quantity")}</TableHead>
                    <TableHead>{t("dialog.labels.price")} ({currency.value})</TableHead>
                    <TableHead>{t("common.totalPrice")} ({currency.value})</TableHead>
                    <TableHead className="text-end">{t("common.table.actions")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {equipments.map((equipment, i) => (
                    <EquipmentRow
                        key={`equipment-${i+1}`}
                        item={equipment}
                        index={i+1}
                    />
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5}>{t("common.totalPrice")}</TableCell>
                    <TableCell className="text-accent-700 font-semibold text-end">{(totalPrice).toFixed(2)} {currency.value}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={5}>{t("common.totalPriceWithFees", { percent: 14 })}</TableCell>
                    <TableCell className="text-accent-700 font-semibold text-end">{(totalPrice * 1.14).toFixed(2)} {currency.value}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};

const EquipmentRow = ({ item, index }) => {
    const { i18n } = useTranslation();
    const equipmentsList = useSelector((state) => state.equipment.list);

    const category = equipmentsList.find((equipment) => equipment.value === item.category);
    const subCategories = category?.data[i18n.language];
    const selectedItem = subCategories.equipments.find((equipment) => equipment.value === item.equipment);

    const totalPrice = item.unit !== "LS" ? Number(item.price) * item.quantity : Number(item.price);

    return (
        <TableRow>
            <TableCell className="font-medium">{index}</TableCell>
            <TableCell>
                {item.type ? capitalizeText(item.type) : selectedItem.label}
                {item.location ? ` (${capitalizeText(item.location)})` : ""}
            </TableCell>
            <TableCell>{item.unit}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{totalPrice}</TableCell>
            <TableCell className="text-end">
                <EquipmentRowActions equipment={item}/>
            </TableCell>
        </TableRow>
    );
};

export default EquipmentsTable;