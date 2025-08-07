import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/Button";

const NavButtons = ({ onBackTo, hideBack }) => {
    const { t } = useTranslation();

    return (
        <div className={`grid gap-10 w-1/2 mx-auto mt-5 ${!hideBack ? "grid-cols-2" : ""}`}>
            {!hideBack && (
                <Button
                    type="button"
                    size="lg"
                    className="flex-row-reverse"
                    onClick={onBackTo}
                >
                    {t("buttons.back")}
                    <ArrowLeftIcon className="rtl:rotate-180"/>
                </Button>
            )}
            <Button size="lg">
                {t("buttons.next")}
                <ArrowRightIcon className="rtl:rotate-180"/>
            </Button>
        </div>
    );
};

export default NavButtons;