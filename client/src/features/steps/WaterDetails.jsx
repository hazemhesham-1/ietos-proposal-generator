import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomFormField from "../../components/CustomFormField";
import NavButtons from "../../components/NavButtons";

const WaterDetails = () => {
    const navigate = useNavigate();
    const [plantTypes, setPlantTypes] = useState([]);

    useEffect(() => {
        async function getTreatmentTypes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/treatment-types`);

                const listOptions = response.data.map(({ name_en, name_ar, short }) => ({ label: name_en, value: `${name_ar}-${short}` }));
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
                label="Treatment Plant Type"
                placeholder="Select plant type"
                options={plantTypes}
            />
            <CustomFormField
                type="number"
                name="flowrate"
                label="Raw Water Flow Rate (m³/day)"
                placeholder="e.g., 5000 m³/day"
                description="Specify the daily treatment capacity of the plant."
                min={80}
            />
            <NavButtons onBackTo={() => navigate("/create-proposal/client-info")}/>
        </>
    );
};

export default WaterDetails;