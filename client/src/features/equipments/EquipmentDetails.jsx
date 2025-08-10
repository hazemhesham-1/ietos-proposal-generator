import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CustomFormField from "@/components/CustomFormField";

const EquipmentDetails = ({ equipments, category }) => {
    const [actions, setActions] = useState([]);
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    useEffect(() => {
        async function getActionTypes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/actions`);
                const localizedOptions = response?.data?.map((action) => ({ label: action.label[lang], value: action.value }));

                setActions(localizedOptions);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getActionTypes();
    }, []);

    return (
        <div className="space-y-5 mt-6">
            <CustomFormField
                type="select"
                name="equipment"
                label={t("forms.labels.equipment", { category })}
                placeholder={t("forms.placeholders.equipment", { category })}
                options={equipments}
                description={t("forms.descriptions.equipment", { category })}
            />
            <CustomFormField
                name="location"
                label={t("forms.labels.equipmentLocation")}
                placeholder={t("forms.placeholders.equipmentLocation")}
                description={t("forms.descriptions.equipmentLocation")}
            />
            <CustomFormField
                type="select"
                name="actionType"
                label={t("forms.labels.actionType")}
                placeholder={t("forms.placeholders.actionType")}
                options={actions}
                description={t("forms.descriptions.actionType")}
            />
        </div>
    );
};

export default EquipmentDetails;