import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CustomFormField from "@/components/CustomFormField";
import NavButtons from "@/components/NavButtons";

const WaterDetails = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [plantTypes, setPlantTypes] = useState([]);

    useEffect(() => {
        async function getTreatmentTypes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/treatment-types`);

                const listOptions = response.data.map((option) => ({ label: option.name[i18n.language], value: JSON.stringify(option) }));
                setPlantTypes(listOptions);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getTreatmentTypes();
    }, []);

    return (
        <>
            <CustomFormField
                type="select"
                name="plantType"
                label={t("forms.labels.treatmentType")}
                placeholder={t("forms.placeholders.treatmentType")}
                options={plantTypes}
            />
            <CustomFormField
                type="number"
                name="flowrate"
                label={t("forms.labels.flowRate")}
                placeholder={t("forms.placeholders.flowRate")}
                description={t("forms.descriptions.flowRate")}
                min={80}
            />
            <NavButtons onBackTo={() => navigate(-1)}/>
        </>
    );
};

export default WaterDetails;