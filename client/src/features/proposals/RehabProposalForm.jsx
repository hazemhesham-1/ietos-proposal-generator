import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PlusIcon, WrenchIcon } from "lucide-react";
import { closeModal, openModal, resetEquipment } from "../equipments/equipmentSlice";
import { Button } from "@/components/ui/Button";
import EquipmentsList from "../equipments/EquipmentsList";

const RehabProposalForm = () => {
    const { t } = useTranslation();
    const { setValue, watch } = useFormContext();
    const equipments = watch("equipments");

    const equipmentData = useSelector((state) => state.equipment.data);
    const dispatch = useDispatch();

    useEffect(() => {
        if(Object.keys(equipmentData).length === 0) return;

        setValue("equipments", [...equipments, equipmentData]);
        dispatch(resetEquipment());
        dispatch(closeModal());
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
                <EquipmentsList equipments={equipments}/>
            </div>
        </div>
    );
};

export default RehabProposalForm;