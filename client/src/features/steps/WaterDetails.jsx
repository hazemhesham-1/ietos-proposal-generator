import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import CustomFormField from "../../components/CustomFormField";
import { Button } from "../../components/ui/Button";

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
            <div className="grid grid-cols-2 gap-10 w-1/2 mx-auto mt-5">
                <Button
                    type="button"
                    size="lg"
                    className="flex-row-reverse"
                    onClick={() => navigate("/create-proposal/client-info")}
                >
                    Back
                    <ArrowLeftIcon/>
                </Button>
                <Button size="lg">
                    Next
                    <ArrowRightIcon/>
                </Button>
            </div>
        </>
    );
};

export default WaterDetails;