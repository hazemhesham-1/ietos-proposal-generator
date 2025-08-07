import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DollarSignIcon, DropletsIcon, FileTextIcon, IdCardIcon, SettingsIcon } from "lucide-react";
import { Form } from "./ui/Form";
import Stepper from "../features/steps/Stepper";

const navLinks = {
    "om-offer": [
        {
            url: "om-offer/client-info",
            name: "clientInfo",
            icon: <IdCardIcon/>
        },
        {
            url: "om-offer/water-details",
            name: "waterDetails",
            icon: <DropletsIcon/>
        },
        {
            url: "om-offer/work-scope",
            name: "businessScope",
            icon: <SettingsIcon/>
        },
        {
            url: "om-offer/financial",
            name: "financialOffer",
            icon: <DollarSignIcon/>
        },
        {
            url: "om-offer/generate-doc",
            name: "generateDocument",
            icon: <FileTextIcon/>
        },
    ]
};

const defaultValues = {
    language: "en",
    id: "",
    companyName: "",
    projectLocation: "",
    projectGovernorate: "",
    contactPerson: "",
    jobTitle: "",
    issueDate: "2025-01-01",
    plantType: "",
    flowrate: 0,
    operationScope: [],
    manpower: [],
    operationSchedule: [],
    chemicalManagement: [],
    replacements: [],
    reports: [],
    workValue: 0,
    currency: "{\"name_en\":\"Egyptian Pound (EGP)\",\"name_ar\":\"جنيهاً مصرياً\",\"value\":\"EGP\"}",
    contractDuration: 12,
    offerValidity: 30,
};

const ProposalForm = ({ children }) => {
    const location = useLocation();
    const { type: proposalType } = useParams();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(null);

    const documentCodes = {
        "om-offer": "OPM",
        "rehab": "REH",
    };
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const documentCode = `I${yearSuffix}${documentCodes[proposalType]}`;

    const methods = useForm({ defaultValues: { ...defaultValues, id: documentCode } });
    
    useEffect(() => {
        const { pathname } = location;
        if(!pathname.includes("/create-proposal")) return;

        const currentPath = pathname.split("/").filter(Boolean)[2];
        const stepIndex = navLinks[proposalType]?.findIndex((step) => step.url === `${proposalType}/${currentPath}`);
        if(stepIndex < 0) return;

        setCurrentStep(stepIndex + 1);
    }, [location]);

    async function onSubmit(data) {
        if(i18n.language !== data.language) {
            i18n.changeLanguage(data.language);
        }

        if(currentStep < navLinks[proposalType].length) {
            navigate(`/create-proposal/${navLinks[proposalType][currentStep].url}`);
        }
        else if(currentStep === navLinks[proposalType].length) {
            const { language, issueDate, plantType } = data;

            const treatmentPlant = JSON.parse(plantType);
            const treatmentType = treatmentPlant[`name_${language}`].split(" ").slice(1).join(" ");

            const additionalData = {
                issueDateString: new Date(issueDate).toLocaleString(language === "ar" ? "ar-EG" : "en-US", { month: "long", year: "numeric" }),
                plantTypeShort: treatmentPlant.short,
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
                <Stepper currentStep={currentStep} steps={navLinks?.[proposalType]}/>
                <div className="flex-1 flex flex-col gap-8 mt-12">
                    {children}
                </div>
            </form>
        </Form>
    );
};

export default ProposalForm;