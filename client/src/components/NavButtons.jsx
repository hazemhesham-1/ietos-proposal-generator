import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/Button";

const NavButtons = ({ onBackTo }) => {
    return (
        <div className="grid grid-cols-2 gap-10 w-1/2 mx-auto mt-5">
            <Button
                type="button"
                size="lg"
                className="flex-row-reverse"
                onClick={onBackTo}
            >
                Back
                <ArrowLeftIcon/>
            </Button>
            <Button size="lg">
                Next
                <ArrowRightIcon/>
            </Button>
        </div>
    );
};

export default NavButtons;