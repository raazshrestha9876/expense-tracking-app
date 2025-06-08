"use client";

import { Menu, Bell, Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/context/sidebarContext";

const Navbar = () => {
  const { toggle }: any = useSidebar();

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
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700">Raaz Shrestha</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
