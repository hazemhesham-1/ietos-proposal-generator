import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { DollarSignIcon, DropletsIcon, FileTextIcon, IdCardIcon, SettingsIcon } from "lucide-react";
import { Form } from "./ui/Form";
import Stepper from "@/features/steps/Stepper";
import EquipmentForm from "@/features/equipments/EquipmentForm";

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
            url: "om-offer/contract-details",
            name: "financialOffer",
            icon: <DollarSignIcon/>
        },
        {
            url: "om-offer/generate-doc",
            name: "generateDocument",
            icon: <FileTextIcon/>
        },
    ],
    "rehab": [
        {
            url: "rehab/client-info",
            name: "clientInfo",
            icon: <IdCardIcon/>
        },
        {
            url: "rehab/water-details",
            name: "waterDetails",
            icon: <DropletsIcon/>
        },
        {
            url: "rehab/work-scope",
            name: "businessScope",
            icon: <SettingsIcon/>
        },
        {
            url: "rehab/contract-details",
            name: "contractDetails",
            icon: <DollarSignIcon/>
        },
        {
            url: "rehab/generate-doc",
            name: "generateDocument",
            icon: <FileTextIcon/>
        },
    ],
    "others": [
        {
            url: "others/client-info",
            name: "clientInfo",
            icon: <IdCardIcon/>
        },
        {
            url: "others/work-scope",
            name: "businessScope",
            icon: <SettingsIcon/>
        },
        {
            url: "others/generate-doc",
            name: "generateDocument",
            icon: <FileTextIcon/>
        },
    ]
};

const defaultValues = {
    language: "en",
    id: "",
    companyName: "",
    projectSubject: "",
    projectLocation: "",
    projectGovernorate: "",
    contactPerson: "",
    jobTitle: "",
    issueDate: "",
    plantType: "",
    flowrate: 0,
    operationScope: [],
    manpower: [],
    operationSchedule: [],
    chemicalManagement: [],
    replacements: [],
    reports: [],
    equipments: [],
    paymentTerms: [
        { value: "50% Down payment." },
        { value: "85% Prorate upon equipment delivery to the site." },
        { value: "100% Upon completion of erection." },
    ],
    workValue: 0,
    currency: "{\"value\":\"EGP\",\"name\":{\"en\":\"Egyptian Pound (EGP)\",\"ar\":\"جنيهاً مصرياً\"}}",
    contractDuration: 12,
    offerValidity: 30,
};

const ProposalForm = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { type: proposalType } = useParams();
    const { t, i18n } = useTranslation();

    const [currentStep, setCurrentStep] = useState(0);
    const numSteps = proposalType ? navLinks[proposalType].length : 0;

    const documentCodes = {
        "om-offer": "OPM",
        "rehab": "REH",
        "others": "OTH",
    };
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const documentCode = documentCodes[proposalType];

    const methods = useForm({ defaultValues: { ...defaultValues, id: `I${yearSuffix}${documentCode}` } });

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

        if(currentStep < numSteps) {
            navigate(`/create-proposal/${navLinks[proposalType][currentStep].url}`);
        }
        else if(currentStep === numSteps) {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/proposals/generate`, { ...data, documentCode }, { responseType: "blob" });

            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${data.id}.docx`;
            link.click();
        }
    }

    return (
        <>
            <Form {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="justify-between gap-20 w-full lg:flex"
                >
                    <Stepper currentStep={currentStep} steps={navLinks[proposalType]}/>
                    <div className="flex-1 flex flex-col gap-8 my-12 px-5 lg:ps-0 lg:pe-16">
                        {proposalType && (currentStep < numSteps) && (
                            <h1 className="text-3xl font-bold">
                                {t(`common.steps.${navLinks[proposalType][currentStep-1]?.name}`)}
                            </h1>
                        )}
                        {children}
                    </div>
                </form>
            </Form>
            {proposalType === "rehab" && <EquipmentForm/>}
        </>
    );
};

export default ProposalForm;