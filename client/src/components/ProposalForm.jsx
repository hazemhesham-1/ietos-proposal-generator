import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DropletsIcon, FileTextIcon, IdCardIcon, SettingsIcon } from "lucide-react";
import { Form } from "./ui/Form";
import Stepper from "../features/steps/Stepper";

const navLinks = [
    {
        url: "client-info",
        name: "Client & Project Info",
        icon: <IdCardIcon/>
    },
    {
        url: "water-details",
        name: "Source Water Details",
        icon: <DropletsIcon/>
    },
    {
        url: "work-scope",
        name: "Business Scope",
        icon: <SettingsIcon/>
    },
    {
        url: "generate-doc",
        name: "Generate Document",
        icon: <FileTextIcon/>
    },
];

const defaultValues = {
    id: "I25OPM123",
    companyName: "",
    projectLocation: "قرية عيون باي - العين السخنه",
    projectGovernorate: "",
    contactPerson: "مهندس وائل عبدالحكيم",
    jobTitle: "مدير الإدارة الهندسيه",
    issueDate: "2025-07-20",
    plantType: "",
    flowrate: 900,
    operationScope: [],
    operationSchedule: [],
    chemicalManagement: []
};

const ProposalForm = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(null);
    const methods = useForm({ defaultValues });

    useEffect(() => {
        const { pathname } = location;
        if(!pathname.includes("/create-proposal")) return;

        const currentPath = pathname.split("/").filter(Boolean)[1];
        const stepIndex = navLinks.findIndex((step) => step.url === currentPath);
        if(stepIndex < 0) return;

        setCurrentStep(stepIndex + 1);
    }, [location]);

    async function onSubmit(data) {
        if(currentStep < navLinks.length) {
            navigate(`/create-proposal/${navLinks[currentStep].url}`);
        }
        else if(currentStep === navLinks.length) {
            const proposalDate = new Date(data?.issueDate);
            const treatmentPlant = data.plantType.split("-");
            const treatmentType = treatmentPlant[0].split(" ").slice(1).join(" ");

            const additionalData = {
                issueDateString: proposalDate.toLocaleString("ar-EG", { month: "long", year: "numeric" }),
                plantType: treatmentPlant[0],
                plantTypeShort: treatmentPlant[1],
                treatmentType,
            };

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/proposals/generate`, { ...data, ...additionalData }, { responseType: "blob" });

            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${data.id}.docx`;
            link.click();
        }
    }

    return (
        <Form {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="flex justify-between gap-20 w-full"
            >
                <Stepper currentStep={currentStep} steps={navLinks}/>
                <div className="flex-1 flex flex-col gap-8 mt-12">
                    {children}
                </div>
            </form>
        </Form>
    );
};

export default ProposalForm;