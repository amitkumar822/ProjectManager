import { useLogoutUserMutation } from "@/redux/features/api/userApi";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { persistor } from "@/redux/app/store";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/app/reduxHook";
import { extractErrorMessage } from "@/utils/apiError";

function Logout() {
    const dispatch = useAppDispatch();
    const [logoutUser, { data, isSuccess, isLoading, error }] = useLogoutUserMutation();

    const handleLogout = async () => {
        await logoutUser();
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Logout Successfull!");
            dispatch(logout());
            persistor.purge();
        } else if (error) {
            toast.error(extractErrorMessage(error) || "Logout Failed");
        }
    }, [error, isSuccess]);

    return (
        <Button
            onClick={handleLogout}
            variant="destructive"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center gap-2 px-5 py-2 shadow-md hover:bg-red-600 transition"
        >
            <LogOut className="w-4 h-4" />
            {isLoading ? "Logging out..." : "Logout"}
        </Button>
    );
}

export default Logout;
