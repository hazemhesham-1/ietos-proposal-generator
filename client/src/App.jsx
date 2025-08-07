import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProposalForm from "./components/ProposalForm";
import Home from "./components/Home";
import ClientDetails from "./features/steps/ClientDetails";
import WaterDetails from "./features/steps/WaterDetails";
import OperationDetails from "./features/steps/OperationDetails";
import PricingDetails from "./features/steps/PricingDetails";
import ProposalGenerator from "./features/steps/ProposalGenerator";
import ProposalSelector from "./features/proposals/ProposalSelector";

const router = createBrowserRouter([
    {
        element: (
            <ProposalForm>
                <Outlet/>
            </ProposalForm>
        ),
        children: [
            { path: "/", element: <Home/> },
            { path: "/create-proposal", element: <ProposalSelector/> },
            { path: "/create-proposal/:type/client-info", element: <ClientDetails/> },
            { path: "/create-proposal/:type/water-details", element: <WaterDetails/> },
            { path: "/create-proposal/:type/work-scope", element: <OperationDetails/> },
            { path: "/create-proposal/:type/financial", element: <PricingDetails/> },
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
        <main className="px-2 py-8 sm:px-8">
            <RouterProvider router={router}/>
        </main>
    );
};

export default App;