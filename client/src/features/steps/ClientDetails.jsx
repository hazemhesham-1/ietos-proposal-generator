import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import CustomFormField from "../../components/CustomFormField";

const ClientDetails = () => {
    const [governorates, setGovernorates] = useState([]);

    useEffect(() => {
        async function getGovernorates() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/governorates`);

                const listOptions = response.data.map(({ name_en, name_ar }) => ({ label: name_en, value: name_ar }));
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
                label="Document Code"
                placeholder="e.g., I25OPM123"
                description="A unique identifier for the document."
            />
            <CustomFormField
                name="companyName"
                label="Company Name"
                placeholder="e.g., Alexandria Water Company"
                description="The name of the company receiving the proposal"
            />
            <CustomFormField
                name="projectLocation"
                label="Project Location"
                placeholder="e.g., 6th of October City, Giza"
                description="Enter the project’s geographical location in Egypt."
            />
            <CustomFormField
                type="select"
                name="projectGovernorate"
                label="Project Governorate"
                placeholder="Select governorate"
                options={governorates}
                description="Select the governorate where the project is located."
            />
            <CustomFormField
                name="contactPerson"
                label="Contact Person"
                placeholder="e.g., Eng. Mohamed Adel"
                description="Enter the name of the engineering manager overseeing this project."
            />
            <CustomFormField
                name="jobTitle"
                label="Contact Person Job Title"
                placeholder="e.g., Head of Engineering Department"
                description="Enter the official job title of the engineering manager responsible for the project."
            />
            <CustomFormField
                type="date"
                name="issueDate"
                label="Proposal Date"
            />
            <Button size="lg" className="w-1/2 mt-5 mx-auto">
                Next
                <ArrowRightIcon/>
            </Button>
        </>
    );
};

export default ClientDetails;