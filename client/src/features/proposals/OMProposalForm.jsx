import { useTranslation } from "react-i18next";
import { CalendarCheckIcon, FileTextIcon, FlaskConicalIcon, RefreshCcwIcon, UsersIcon, WrenchIcon } from "lucide-react";
import Checklist from "@/components/Checklist";
import NestedChecklist from "@/components/NestedChecklist";
import DynamicFormField from "@/components/DynamicFormField";

const OMProposalForm = ({ operations }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-16">
            <Checklist
                name="operationScope"
                title={t("common.operationMaintenanceScope")}
                itemsList={operations.tasks}
                icon={<WrenchIcon/>}
            />
            <Checklist
                name="manpower"
                title={t("common.manpower")}
                itemsList={operations.manpower}
                icon={<UsersIcon/>}
            />
            <NestedChecklist
                name="operationSchedule"
                title={t("common.operationsSchedule")}
                itemsList={operations.schedules}
                icon={<CalendarCheckIcon/>}
            />
            <Checklist
                name="chemicalManagement"
                title={t("common.chemicalsManagement")}
                itemsList={operations.chemicals}
                icon={<FlaskConicalIcon/>}
            />
            <DynamicFormField
                name="reports"
                label={t("common.reports")}
                icon={<FileTextIcon/>}
            />
            <NestedChecklist
                name="replacements"
                title={t("common.replacements")}
                itemsList={operations.replacements}
                icon={<RefreshCcwIcon/>}
            />
        </div>
    );
};

export default OMProposalForm;