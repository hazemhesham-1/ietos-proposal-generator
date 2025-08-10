import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CustomFormField from "@/components/CustomFormField";
import NavButtons from "@/components/NavButtons";

const ClientDetails = () => {
    const { t, i18n } = useTranslation();
    const { type: proposalType } = useParams();
    const [governorates, setGovernorates] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    const languages = [
        {
            label: {
                ar: "العربية",
                en: "Arabic"
            },
            value: "ar"
        },
        {
            label: {
                ar: "الإنجليزية",
                en: "English"
            },
            value: "en"
        },
    ];

    useEffect(() => {
        async function getGovernorates() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/governorates`);
                
                const listOptions = response.data.map((option) => ({ label: option.name[i18n.language], value: JSON.stringify(option) }));
                setGovernorates(listOptions);
            }
            catch(err) {
                console.error(err.message);
            }
        }
        async function getCurrencies() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/currencies`);

                const listOptions = response.data.map(({ _id, ...option }) => ({ label: option.name.en, value: JSON.stringify(option) }));
                setCurrencies(listOptions);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getGovernorates();
        if(proposalType === "rehab") {
            getCurrencies();
        }
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
                name="projectSubject"
                label={t("forms.labels.projectSubject")}
                placeholder={t("forms.placeholders.projectSubject")}
                description={t("forms.descriptions.projectSubject")}
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
                options={languages.map((lang) => ({ label: lang.label[i18n.language], value: lang.value }))}
            />
            {proposalType === "rehab" && (
                <CustomFormField
                    type="select"
                    name="currency"
                    label={t("forms.labels.currency")}
                    placeholder={t("forms.placeholders.currency")}
                    options={currencies}
                />
            )}
            <NavButtons hideBack={true}/>
        </>
    );
};

export default ClientDetails;