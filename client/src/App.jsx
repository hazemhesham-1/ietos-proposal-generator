import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import ProposalForm from "./components/ProposalForm";
import ClientDetails from "./features/steps/ClientDetails";
import WaterDetails from "./features/steps/WaterDetails";
import OperationDetails, { loader as operationsLoader } from "./features/steps/OperationDetails";
import ContractDetails from "./features/steps/ContractDetails";
import ProposalGenerator from "./features/steps/ProposalGenerator";
import ProposalSelector from "./features/proposals/ProposalSelector";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            { index: true, element: <Home/> },
            { path: "/create-proposal", element: <ProposalSelector/> },
        ]
    },
    {
        element: (
            <ProposalForm>
                <Outlet/>
            </ProposalForm>
        ),
        children: [
            { path: "/create-proposal/:type/client-info", element: <ClientDetails/> },
            { path: "/create-proposal/:type/water-details", element: <WaterDetails/> },
            { path: "/create-proposal/:type/work-scope", element: <OperationDetails/>, loader: operationsLoader },
            { path: "/create-proposal/:type/contract-details", element: <ContractDetails/> },
            { path: "/create-proposal/:type/generate-doc", element: <ProposalGenerator/> },
        ],
    }
]);

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const isArabic = i18n.language === "ar";

        document.documentElement.setAttribute("dir", isArabic ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", isArabic ? "ar" : "en");
        document.body.style.fontFamily = isArabic ? "'Cairo', sans-serif" : "'Poppins', sans-serif";
    }, [i18n.language]);

    return (
        <RouterProvider router={router}/>
    );
};

export default App;