import {
  BookText,
  CircleX,
  HandCoins,
  LayoutDashboard,
  PiggyBank,
} from "lucide-react";
import { useSidebar } from "@/context/sidebarContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { isOpen, toggle }: any = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 shadow-sm",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center  p-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8"
              src="https://m.media-amazon.com/images/I/61AxZXJ1u7L.png"
              alt="expenso"
            />
            <h1 className="text-slate-800 text-xl font-bold tracking-wide">
              Expenso
            </h1>
          </div>
          <CircleX
            size={30}
            className="cursor-pointer hover:opacity-80"
            onClick={toggle}
          />
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-700 font-medium bg-slate-100 hover:bg-slate-100"
              >
                <LayoutDashboard className="h-5 w-5 text-slate-600" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/expense"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 font-medium hover:bg-slate-100"
              >
                <HandCoins className="h-5 w-5 text-slate-500" />
                <span>Expenses</span>
              </Link>
            </li>
            <li>
              <Link
                to="/income"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 font-medium hover:bg-slate-100"
              >
                <PiggyBank className="h-5 w-5 text-slate-500" />
                <span>Savings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/report"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 font-medium hover:bg-slate-100"
              >
                <BookText className="h-5 w-5 text-slate-500" />
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600 font-medium">Need help?</p>
            <p className="text-xs text-slate-500 mt-1">
              Check our documentation
            </p>
            <a
              href="#"
              className="text-xs text-blue-600 font-medium mt-2 inline-block"
            >
              View docs
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
