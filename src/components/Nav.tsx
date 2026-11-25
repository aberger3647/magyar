import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/SearchDialog";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Home", to: "/" },
  { title: "Conjugator", to: "/conjugator" },
  { title: "Flash Cards", to: "/flash-cards" },
  { title: "Grammar", to: "/grammar" },
  { title: "Phrasebook", to: "/phrasebook" },
  { title: "Érzés", to: "/erzes" },
  { title: "Blog", to: "/blog" },
];

export function Nav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { pathname } = useLocation();
  const simpleLinks = menuItems.filter((link) => link.title != "Flash Cards");
  const isLinkActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="border-b border-border/60 bg-background">
      <div className="flex items-center justify-between px-3 py-2 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-lg" aria-label="Open Menu">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[270px] overflow-y-auto sm:w-[300px]">
            <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border/60 pr-14">
              <SheetTitle className="text-left text-base">Learn Magyar Language</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation links and theme settings
              </SheetDescription>
              <ThemeToggle />
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1 px-4 pb-6">
              {simpleLinks.map((item) => {
                const active = isLinkActive(item.to);
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      active && "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <Link
                to="/search"
                aria-current={isLinkActive("/search") ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isLinkActive("/search") && "bg-accent text-accent-foreground",
                )}
              >
                Search
              </Link>
              <Link
                to="/flash-cards"
                aria-current={pathname === "/flash-cards" ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  pathname === "/flash-cards" && "bg-accent text-accent-foreground",
                )}
              >
                Study Flash Cards
              </Link>
              <Link
                to="/flash-cards/create"
                aria-current={pathname === "/flash-cards/create" ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  pathname === "/flash-cards/create" && "bg-accent text-accent-foreground",
                )}
              >
                Create Flash Cards
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          to="/"
          className="rounded-md px-2 py-1 text-base font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-lg"
        >
          Learn Magyar Language
        </Link>
        <div className="flex items-center gap-1">
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>

      <div className="hidden items-center justify-between gap-4 px-4 py-2 lg:flex">
        <Link
          to="/"
          className="shrink-0 whitespace-nowrap rounded-md text-xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none xl:text-2xl"
        >
          Learn Magyar Language
        </Link>
        <div className="flex items-center gap-2">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {simpleLinks.map((item) => {
                const active = isLinkActive(item.to);
                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      asChild
                      active={active}
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Flash Cards
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid min-w-32 gap-1">
                    <li>
                      <NavigationMenuLink asChild active={pathname === "/flash-cards"}>
                        <Link
                          to="/flash-cards"
                          aria-current={pathname === "/flash-cards" ? "page" : undefined}
                          className="whitespace-normal text-left"
                        >
                          Study
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild active={pathname === "/flash-cards/create"}>
                        <Link
                          to="/flash-cards/create"
                          aria-current={pathname === "/flash-cards/create" ? "page" : undefined}
                          className="whitespace-normal text-left"
                        >
                          Create
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
