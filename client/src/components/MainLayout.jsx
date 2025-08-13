import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
    return (
        <>
            <Header/>
            <main className="bg-[url('/background.png')] bg-cover flex flex-col gap-8 min-h-screen px-2 py-8 sm:px-8">
                <Outlet/>
            </main>
        </>
    );
};

export default MainLayout;