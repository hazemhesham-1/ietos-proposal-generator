import { Button } from "@/components/ui/Button";
import Spinner from "@/components/Spinner";

const SubmitButton = ({ children, isSubmitting }) => {
    return (
        <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 w-full max-w-xl text-base"
        >
            {!isSubmitting ? children : <Spinner/>}
        </Button>
    );
};

export default SubmitButton;