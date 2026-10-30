import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const ToggleContainer = () => {
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>

        <nav className="gap-6 flex flex-col items-start">
          <NavigationRoutes isMobile />
          <NavLink
            to={"/generate"}
            className={({ isActive }) =>
              cn(
                "text-base text-neutral-600 ",
                isActive && "text-neutral-900 font-semibold"
              )
            }
          >
            Take An Interview
          </NavLink>
          <NavLink
            to={"/generate/resume"}
            className={({ isActive }) =>
              cn(
                "text-base text-neutral-600 ",
                isActive && "text-neutral-900 font-semibold"
              )
            }
          >
            Resume Builder
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
