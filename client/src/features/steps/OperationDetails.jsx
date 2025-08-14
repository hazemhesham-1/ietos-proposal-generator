import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initEquipmentList } from "../equipments/equipmentSlice";
import { getEquipments } from "@/services/apiEquipments";
import { getOperations } from "@/services/apiOperations";
import NavButtons from "@/components/NavButtons";
import OMProposalForm from "@/features/proposals/OMProposalForm";
import RehabProposalForm from "@/features/proposals/RehabProposalForm";
import { useEffect } from "react";

const OperationDetails = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    
    const dispatch = useDispatch();
    const data = useLoaderData();

    useEffect(() => {
        if(type !== "rehab") return;
        dispatch(initEquipmentList(data));
    }, []);

    return (
        <>
            {type === "om-offer" && <OMProposalForm operations={data}/>}
            {type === "rehab" && <RehabProposalForm/>}
            <NavButtons onBackTo={() => navigate(-1)}/>
        </>
    );
};

export async function loader({ params }) {
    const { type } = params;

    if(type === "om-offer") {
        const operations = await getOperations();
        return operations;
    }
    else if(type === "rehab") {
        const equipments = await getEquipments();
        return equipments;
    }
}

export default OperationDetails;