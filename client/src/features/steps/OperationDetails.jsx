import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { CalendarCheckIcon, FlaskConicalIcon, WrenchIcon } from "lucide-react";
import { Checkbox } from "../../components/ui/Checkbox";
import CustomFormField from "../../components/CustomFormField";
import NavButtons from "../../components/NavButtons";

const OperationDetails = () => {
    const navigate = useNavigate();
    const [operations, setOperations] = useState({});
    const [schedules, setSchedules] = useState([]);
    const { setValue, watch } = useFormContext();

    const operationSchedule = watch("operationSchedule");
    const isIncluded = (item, arr) => arr.some((value) => item.startsWith(value));

    function onScheduleChecked(item, checked) {
        const newSchedules = checked ? [...schedules, item.value] : schedules.filter((value) => value !== item.value);
        setSchedules(newSchedules);
        setValue("operationSchedule", operationSchedule.filter((operation) => isIncluded(operation, newSchedules)));
    }

    useEffect(() => {
        async function getOperations() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/lookup/operations`);
                setOperations(response.data);
            }
            catch(err) {
                console.error(err.message);
            }
        }

        getOperations();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold">
                Business scope
            </h1>
            <div className="flex flex-col gap-8 mb-5" dir="rtl">
                <div className="text-slate-800 flex items-center gap-2">
                    <WrenchIcon className="size-6"/>
                    <h2 className="text-xl font-extrabold">
                        Operation & Maintenance Scope
                    </h2>
                </div>
                {operations.tasks?.map((item) => (
                    <CustomFormField
                        key={item.id}
                        type="checkbox"
                        name="operationScope"
                        item={item}
                        label={item.label}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-8 mb-5" dir="rtl">
                <div className="text-slate-800 flex items-center gap-2">
                    <CalendarCheckIcon className="size-6"/>
                    <h2 className="text-xl font-extrabold">
                        Operations Schedule
                    </h2>
                </div>
                {operations.periods?.map((item) => (
                    <div key={item.value}>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={schedules.includes(item.value)}
                                onCheckedChange={(checked) => onScheduleChecked(item, checked)}
                            />
                            <p>تضمين {item.label}</p>
                        </div>
                        {schedules.includes(item.value) && (
                            <div className="space-y-2 mt-2 mb-5">
                                {operations.schedules?.[item.value].map((subItem) => (
                                    <CustomFormField
                                        key={subItem.id}
                                        type="checkbox"
                                        name="operationSchedule"
                                        item={subItem}
                                        label={subItem.label}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-8 mb-16" dir="rtl">
                <div className="text-slate-800 flex items-center gap-2">
                    <FlaskConicalIcon className="size-6"/>
                    <h2 className="text-xl font-extrabold">
                        Chemicals Management
                    </h2>
                </div>
                {operations.chemicals?.map((item) => (
                    <CustomFormField
                        key={item.id}
                        type="checkbox"
                        name="chemicalManagement"
                        item={item}
                        label={item.label}
                    />
                ))}
            </div>
            <NavButtons onBackTo={() => navigate("/create-proposal/water-details")}/>
        </>
    );
};

export default OperationDetails;