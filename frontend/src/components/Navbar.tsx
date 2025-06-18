import { Menu, Bell, Search, LogOutIcon, User2Icon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogoutMutation } from "@/redux/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store/store";
import { setLogout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { toast } from "react-toastify";
import { expenseApi } from "@/redux/services/expenseApi";
import { clearExpenseNotification } from "@/redux/slices/expenseSlice";
import { useSidebar } from "@/hooks/useSidebar";

const Navbar = () => {
  const { toggle }: any  = useSidebar();
  const dispatch = useDispatch<AppDispatch>();
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { expenseNotificationCount } = useSelector(
    (state: RootState) => state.expenses
  );

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setLogout());
      dispatch(expenseApi.util.invalidateTags(["Expense"]));
      dispatch(clearExpenseNotification());
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 flex justify-between items-center py-3 px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="hidden md:flex relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 w-[240px] bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-slate-100 relative"
          >
            {expenseNotificationCount > 0 && (
              <span className="absolute bg-red-700 text-white rounded-full object-contain px-[5px] py-[1px] text-[12px] top-1 right-5">
                {expenseNotificationCount}
              </span>
            )}
            <Bell className="h-8 w-8" size={28} />
            <span className="sr-only">Notifications</span>
          </Button>
        )}

        <Popover>
          <PopoverTrigger>
            <div className="flex items-center cursor-pointer gap-3 border-l border-slate-200 pl-3">
              {isAuthenticated ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg" />
                    <AvatarFallback>{user?.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-700">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.gender}</p>
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-700">User</p>
                    <p className="text-xs text-slate-500">Guest</p>
                  </div>
                </>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] mr-4 mt-2">
            <div className="flex flex-col gap-4 p-2">
              <li className="flex flex-start gap-2 cursor-pointer">
                <LogOutIcon />
                <p onClick={handleLogout} className="hover:underline">
                  {isLoading ? "Loading..." : "Logout"}
                </p>
              </li>
              <li className="flex flex-start gap-2 cursor-pointer">
                <User2Icon />
                <p
                  onClick={() => navigate("/profile")}
                  className="hover:underline"
                >
                  {isLoading ? "Loading..." : "Profile Settings"}
                </p>
              </li>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Navbar;
