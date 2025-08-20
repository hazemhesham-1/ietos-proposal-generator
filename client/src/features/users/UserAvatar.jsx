import { useTranslation } from "react-i18next";
import { useLogoutMutation } from "../auth/authApiSlice";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/DropdownMenu";

const UserAvatar = ({ name }) => {
    const [logout, { isLoading }] = useLogoutMutation();
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <div className="flex items-center gap-4">
                <DropdownMenuTrigger asChild>
                    <img
                        className="rounded-full size-10 cursor-pointer"
                        src="/avatar-placeholder.png"
                        alt={`${name} user avatar`}
                    />
                </DropdownMenuTrigger>
                <div className="capitalize font-medium">
                    {name}
                </div>
            </div>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={logout}>
                    {isLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserAvatar;