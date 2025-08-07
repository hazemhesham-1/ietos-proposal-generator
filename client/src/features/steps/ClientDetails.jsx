import { useEffect, useState } from "react";
import axios from "axios";
import CustomFormField from "../../components/CustomFormField";
import NavButtons from "../../components/NavButtons";
import { useTranslation } from "react-i18next";

const ClientDetails = () => {
    const { t, i18n } = useTranslation();
    const [governorates, setGovernorates] = useState([]);

    const languages = [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
    ];

    useEffect(() => {
        async function getGovernorates() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/governorates`);
                
                const listOptions = response.data.map((option) => ({ label: option[`name_${i18n.language}`], value: JSON.stringify(option) }));
                setGovernorates(listOptions);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getGovernorates();
    }, []);

    return (
        <>
            <CustomFormField
                name="id"
                label={t("forms.labels.documentCode")}
                placeholder={t("forms.placeholders.documentCode")}
                description={t("forms.descriptions.documentCode")}
            />
            <CustomFormField
                name="companyName"
                label={t("forms.labels.companyName")}
                placeholder={t("forms.placeholders.companyName")}
                description={t("forms.descriptions.companyName")}
            />
            <CustomFormField
                name="projectLocation"
                label={t("forms.labels.projectLocation")}
                placeholder={t("forms.placeholders.projectLocation")}
                description={t("forms.descriptions.projectLocation")}
            />
            <CustomFormField
                type="select"
                name="projectGovernorate"
                label={t("forms.labels.projectGovernorate")}
                placeholder={t("forms.placeholders.projectGovernorate")}
                options={governorates}
                description={t("forms.descriptions.projectGovernorate")}
            />
            <CustomFormField
                name="contactPerson"
                label={t("forms.labels.contactPerson")}
                placeholder={t("forms.placeholders.contactPerson")}
                description={t("forms.descriptions.contactPerson")}
            />
            <CustomFormField
                name="jobTitle"
                label={t("forms.labels.jobTitle")}
                placeholder={t("forms.placeholders.jobTitle")}
                description={t("forms.descriptions.jobTitle")}
            />
            <CustomFormField
                type="date"
                name="issueDate"
                label={t("forms.labels.issueDate")}
            />
            <CustomFormField
                type="select"
                name="language"
                label={t("forms.labels.proposalLanguage")}
                placeholder={t("forms.placeholders.proposalLanguage")}
                options={languages}
            />
            <NavButtons hideBack={true}/>
        </>
    );
};

export default ClientDetails;