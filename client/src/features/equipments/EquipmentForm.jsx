import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { closeModal, nextStep, prevStep, setEquipmentData } from "./equipmentSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import CategoryCard from "./CategoryCard";
import EquipmentDetails from "./EquipmentDetails";
import EquipmentSpecs from "./EquipmentSpecs";

const defaultValues = {
    category: "",
    equipment: "",
    location: "",
    actionType: "",
    quantity: 1,
};

const EquipmentForm = () => {
    const { t, i18n } = useTranslation();
    const methods = useForm({ defaultValues });
    
    const dispatch = useDispatch();
    const { isModalOpen, currentStep: modalStep, list: equipmentsList } = useSelector((state) => state.equipment);
    const equipments = equipmentsList?.map(({ data, fields, value }) => ({ ...data[i18n.language], fields, value }));

    const category = methods.watch("category");
    const selectedCategory = equipments?.find((equipment) => equipment.value === category);
    const stepKeys = ["equipmentCategory", "equipmentDetails", "equipmentSpecs"];

    const isLastStep = modalStep === stepKeys.length;

    function onSubmit(data) {
        if(!isLastStep) {
            dispatch(nextStep());
            return;
        }

        dispatch(setEquipmentData(data));
        methods.reset(defaultValues);
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={(open) => !open && dispatch(closeModal())}
        >
            <DialogContent className="p-0 sm:max-w-4xl">
                <Form {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <DialogHeader className="border-b border-border p-4 md:p-6">
                            <DialogTitle className="text-xl">
                                {t("dialog.titles.equipment")}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 px-4 py-2 max-h-[400px] overflow-auto md:px-6">
                            {(modalStep <= stepKeys.length) && (
                                <DialogDescription>
                                    {t(`dialog.steps.${stepKeys[modalStep-1]}`, { step: modalStep })}
                                </DialogDescription>
                            )}
                            {(modalStep === 1) && (
                                <ul className="grid gap-4 md:grid-cols-2">
                                    {equipments?.map((equipment, i) => (
                                        <CategoryCard
                                            key={equipment.value}
                                            id={`cat-${i+1}`}
                                            label={equipment.category}
                                            value={equipment.value}
                                            description={equipment.description}
                                            image={`/equipments/${equipment.value}.png`}
                                        />
                                    ))}
                                </ul>
                            )}
                            {(modalStep === 2) && (
                                <EquipmentDetails
                                    category={selectedCategory.category}
                                    equipments={selectedCategory.equipments}
                                />
                            )}
                            {isLastStep && <EquipmentSpecs keys={selectedCategory?.fields}/>}
                        </div>
                        <DialogFooter className="flex flex-col p-4 md:p-6 sm:flex-row">
                            {modalStep > 1 && (
                                <Button type="button" onClick={() => dispatch(prevStep())}>
                                    {t("buttons.previous")}
                                </Button>
                            )}
                            <Button type="submit" disabled={!category}>
                                {!isLastStep ? t("buttons.next") : t("buttons.addEquipment")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EquipmentForm;