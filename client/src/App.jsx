import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProposalForm from "./components/ProposalForm";
import Home from "./components/Home";
import ClientDetails from "./features/steps/ClientDetails";
import WaterDetails from "./features/steps/WaterDetails";
import OperationDetails from "./features/steps/OperationDetails";
import PricingDetails from "./features/steps/PricingDetails";
import ProposalGenerator from "./features/steps/ProposalGenerator";

const router = createBrowserRouter([
    {
        element: (
            <ProposalForm>
                <Outlet/>
            </ProposalForm>
        ),
        children: [
            { path: "/", element: <Home/> },
            { path: "/create-proposal/client-info", element: <ClientDetails/> },
            { path: "/create-proposal/water-details", element: <WaterDetails/> },
            { path: "/create-proposal/work-scope", element: <OperationDetails/> },
            { path: "/create-proposal/financial", element: <PricingDetails/> },
            { path: "/create-proposal/generate-doc", element: <ProposalGenerator/> },
        ],
    }
]);

function App() {
    return (
        <main className="px-2 py-8 sm:px-8">
            <RouterProvider router={router}/>
        </main>
    );
};

export default App;