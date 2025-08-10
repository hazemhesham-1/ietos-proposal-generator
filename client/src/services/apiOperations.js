import axios from "axios";

export async function getOperations() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/operations`);
        return response.data;
    }
    catch(err) {
        console.error(err.message);
    }
}