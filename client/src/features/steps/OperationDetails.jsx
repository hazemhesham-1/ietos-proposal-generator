import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { CalendarCheckIcon, FileTextIcon, FlaskConicalIcon, RefreshCcwIcon, UsersIcon, WrenchIcon } from "lucide-react";
import NavButtons from "../../components/NavButtons";
import Checklist from "./Checklist";
import NestedChecklist from "./NestedChecklist";
import DynamicFormField from "./DynamicFormField";

const OperationDetails = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [operations, setOperations] = useState({});

    useEffect(() => {
        async function getOperations() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/operations`);
                setOperations(response.data);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getOperations();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold">
                {t("common.businessScope")}
            </h1>
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
            <NavButtons onBackTo={() => navigate(-1)}/>
        </>
    );
};

export default OperationDetails;