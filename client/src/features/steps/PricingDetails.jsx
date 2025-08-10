import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { isValidJSON } from "@/lib/utils";
import CustomFormField from "@/components/CustomFormField";
import NavButtons from "@/components/NavButtons";

const PricingDetails = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { watch } = useFormContext();
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
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
        
        getCurrencies();
    }, []);

    const monthlyWorkValue = watch("workValue");
    const currencyValue = watch("currency");
    const currency = isValidJSON(currencyValue) ? JSON.parse(currencyValue) : null;

    const monthlyTaxAmount = monthlyWorkValue * 0.14;
    const annualWorkValue = monthlyWorkValue * 12;
    const annualTaxAmount = annualWorkValue * 0.14;

    return (
        <>
            <CustomFormField
                type="number"
                name="workValue"
                label={t("forms.labels.monthlyWorks")}
                placeholder={t("forms.placeholders.monthlyWorks")}
                description={t("forms.descriptions.monthlyWorks")}
                min={0}
            />
            <CustomFormField
                type="select"
                name="currency"
                label={t("forms.labels.currency")}
                placeholder={t("forms.placeholders.currency")}
                options={currencies}
            />
            {monthlyWorkValue > 0 && (
                <>
                    <div className="text-red-700 text-sm font-semibold">
                        <p>
                            {t("forms.labels.monthlyWorks")}: {monthlyWorkValue} {currency?.value}
                        </p>
                        <p>
                            {t("forms.labels.monthlyTaxAmount")}: {monthlyTaxAmount.toFixed(1)} {currency?.value}
                        </p>
                        <p>
                            {t("forms.labels.monthlyWithTax")}: {Math.round(Number(monthlyWorkValue) + Number(monthlyTaxAmount))} {currency?.value}
                        </p>
                    </div>
                    <div className="text-red-700 text-sm font-semibold">
                        <p>
                            {t("forms.labels.annualWorks")}: {annualWorkValue} {currency?.value}
                        </p>
                        <p>
                            {t("forms.labels.annualTaxAmount")}: {annualTaxAmount.toFixed(1)} {currency?.value}
                        </p>
                        <p>
                            {t("forms.labels.annualWithTax")}: {Math.round(Number(annualWorkValue) + Number(annualTaxAmount))} {currency?.value}
                        </p>
                    </div>
                </>
            )}
            <CustomFormField
                type="number"
                name="contractDuration"
                label={t("forms.labels.contractDuration")}
                placeholder={t("forms.placeholders.contractDuration")}
                description={t("forms.descriptions.contractDuration")}
                min={12}
            />
            <CustomFormField
                type="number"
                name="offerValidity"
                label={t("forms.labels.offerValidity")}
                placeholder={t("forms.placeholders.offerValidity")}
                description={t("forms.descriptions.offerValidity")}
                min={0}
            />
            <NavButtons onBackTo={() => navigate(-1)}/>
        </>
    );
};

export default PricingDetails;