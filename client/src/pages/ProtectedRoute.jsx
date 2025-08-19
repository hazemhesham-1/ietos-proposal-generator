import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../features/auth/authSlice";
import Loader from "@/components/Loader";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if(isAuthenticated) {
            setIsLoading(false);
            return;
        }

        async function verifyRefreshToken() {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, { withCredentials: true });
                dispatch(setCredentials(response.data));
            }
            catch(err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        verifyRefreshToken();
    }, []);

    if(isLoading) return <Loader/>;

    return isAuthenticated ? (
        <Outlet/>
    ) : (
        <Navigate to="/auth/employee/login" state={{ from: location }} replace/>
    );
};

export default ProtectedRoute;