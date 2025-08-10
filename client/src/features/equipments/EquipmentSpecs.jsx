import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CustomFormField from "@/components/CustomFormField";

const EquipmentSpecs = ({ keys }) => {
    const [fields, setFields] = useState([]);

    useEffect(() => {
        async function getFieldTypes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/specification-fields`);
                setFields(response?.data);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getFieldTypes();
    }, []);

    return (
        <div className="space-y-5 mt-6">
            {keys?.map((key) => (
                <EquipmentField
                    key={key}
                    name={key}
                    fields={fields}
                />
            ))}
        </div>
    );
};

const EquipmentField = ({ name, fields }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const field = fields?.find((field) => field.key === name);
    const options = field?.options?.map(({ labels, value }) => ({ label: labels[lang], value }));

    return (
        <CustomFormField
            type={field?.type}
            name={name}
            label={t(`dialog.labels.${name}`)}
            placeholder={t(`dialog.placeholders.${name}`)}
            options={options ? options : undefined}
        />
    );
};

export default EquipmentSpecs;