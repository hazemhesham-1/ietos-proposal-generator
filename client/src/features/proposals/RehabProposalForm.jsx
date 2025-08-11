import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PlusIcon, WrenchIcon } from "lucide-react";
import { openModal, resetEquipment } from "../equipments/equipmentSlice";
import { Button } from "@/components/ui/Button";
import EquipmentsTable from "../equipments/EquipmentsTable";

const RehabProposalForm = () => {
    const { t } = useTranslation();
    const { setValue, watch } = useFormContext();
    const equipments = watch("equipments");

    const { data: equipmentData, isEditModal } = useSelector((state) => state.equipment);
    const dispatch = useDispatch();

    useEffect(() => {
        if((Object.keys(equipmentData).length === 0) || isEditModal) return;

        const isEdited = equipments.some((equipment) => equipment.id === equipmentData.id);
        if(isEdited) {
            const updatedEquipments = equipments.map((equipment) => equipment.id === equipmentData.id ? equipmentData : equipment);
            setValue("equipments", updatedEquipments);
        }
        else {
            setValue("equipments", [ ...equipments, equipmentData ]);
        }

        dispatch(resetEquipment());
    }, [equipmentData]);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2">
                <WrenchIcon className="size-6"/>
                <h2 className="text-slate-800 text-xl font-extrabold">
                    {t("forms.labels.workScope")}
                </h2>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => dispatch(openModal())}
                >
                    <PlusIcon/>
                </Button>
            </div>
            <p className="text-muted-foreground text-sm">
                {t("forms.descriptions.workScope")}
            </p>
            <div>
                <EquipmentsTable equipments={equipments}/>
            </div>
        </div>
    );
};

export default RehabProposalForm;