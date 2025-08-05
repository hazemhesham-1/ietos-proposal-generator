import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import CustomFormField from "../../components/CustomFormField";
import NavButtons from "../../components/NavButtons";

const PricingDetails = () => {
    const navigate = useNavigate();
    const { watch } = useFormContext();
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        async function getCurrencies() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/currencies`);

                const listOptions = response.data.map(({ name_en, name_ar, value }) => ({ label: name_en, value: `${value}-${name_ar}` }));
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
    const currency = currencyValue.split("-")[0];

    const monthlyTaxAmount = monthlyWorkValue * 0.14;
    const annualWorkValue = monthlyWorkValue * 12;
    const annualTaxAmount = annualWorkValue * 0.14;

    return (
        <>
            <CustomFormField
                type="number"
                name="workValue"
                label="Monthly Value of Works"
                placeholder="e.g. 150,000"
                description="Enter the monthly value of the proposed works, excluding tax"
                min={0}
            />
            <CustomFormField
                type="select"
                name="currency"
                label="Currency"
                placeholder="Select currency"
                options={currencies}
            />
            {monthlyWorkValue > 0 && (
                <>
                    <div className="text-red-700 text-sm font-semibold">
                        <p>
                            Monthly Value of Works: {monthlyWorkValue} {currency}
                        </p>
                        <p>
                            Monthly Tax Amount: {monthlyTaxAmount.toFixed(1)} {currency}
                        </p>
                        <p>
                            Monthly Total Including Tax: {Math.round(Number(monthlyWorkValue) + Number(monthlyTaxAmount))} {currency}
                        </p>
                    </div>
                    <div className="text-red-700 text-sm font-semibold">
                        <p>
                            Annual Value of Works: {annualWorkValue} {currency}
                        </p>
                        <p>
                            Annual Tax Amount: {annualTaxAmount.toFixed(1)} {currency}
                        </p>
                        <p>
                            Annual Total Including Tax: {Math.round(Number(annualWorkValue) + Number(annualTaxAmount))} {currency}
                        </p>
                    </div>
                </>
            )}
            <CustomFormField
                type="number"
                name="contractDuration"
                label="Contract Duration (Months)"
                placeholder="e.g., 12 months"
                description="Specify the duration of the contract period."
                min={12}
            />
            <CustomFormField
                type="number"
                name="offerValidity"
                label="Offer Validity (Days)"
                placeholder="e.g., 30 days"
                description="Specify how long the financial and technical offer remains valid from the date of submission."
                min={0}
            />
            <NavButtons onBackTo={() => navigate("/create-proposal/work-scope")}/>
        </>
    );
};

export default PricingDetails;