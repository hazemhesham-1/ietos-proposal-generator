import { SparklesIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";

const ProposalGenerator = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
            <h1 className="text-slate-700 text-2xl font-semibold">
                Finalize & Generate Proposal
            </h1>
            <p className="text-slate-500 text-xl">
                You’ve completed all the required steps. Now, generate a tailored technical proposal for your water treatment solution.{" "}
                Review the content after generation to ensure accuracy and alignment with client needs.
            </p>
            <Button size="lg">
                <SparklesIcon className="size-4"/>
                Generate Proposal
            </Button>
        </div>
    );
};

export default ProposalGenerator;