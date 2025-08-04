import { NavLink } from "react-router-dom";
import { CheckIcon } from "lucide-react";

const Stepper = ({ currentStep, steps = [] }) => {
    if(!currentStep) return null;

    return (
        <nav className="rounded-2xl relative p-10 overflow-hidden shadow-md min-h-screen">
            <img
                src="/water-treatment-bg.png"
                alt="Water Treatment Plant"
                className="absolute inset-0 object-cover size-full"
            />
            <ol className="border-s-2 border-slate-200 relative">
                {steps.map((step, i) => (
                    <li
                        key={step.url}
                        className={`${currentStep === i+1 ? "text-primary-500" : "text-slate-500"} flex items-center ms-9 mb-16 font-medium`}
                    >
                        <span className={`${currentStep > i+1 ? "bg-green-200 text-green-500" : "bg-slate-100"} rounded-full flex items-center justify-center absolute -start-6 size-12`}>
                            {currentStep <= i+1 ? step.icon : <CheckIcon/>}
                        </span>
                        <NavLink
                            to={`/create-proposal/${step.url}`}
                            className={({ isActive }) => isActive ? "text-primary-400" : currentStep > i+1 ? "text-green-400" : "text-slate-100 hover:text-slate-300"}
                        >
                            {step.name}
                        </NavLink>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Stepper;