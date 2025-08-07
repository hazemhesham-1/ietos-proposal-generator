import { SparklesIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useTranslation } from "react-i18next";

const ProposalGenerator = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
                <h1 className="text-slate-700 text-2xl font-semibold">
                    {t("messages.generateDocument.title")}
                </h1>
                <p className="text-slate-500 text-xl">
                    {t("messages.generateDocument.description")}
                </p>
            </div>
            <Button size="lg">
                <SparklesIcon className="size-4"/>
                {t("buttons.generateProposal")}
            </Button>
        </>
    );
};

export default ProposalGenerator;