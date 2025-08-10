import axios from "axios";

export async function getEquipments() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/equipments`);
        return response.data;
    }
    catch(err) {
        console.error(err.message);
    }
}