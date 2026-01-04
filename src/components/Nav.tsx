import * as React from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react" // Import Menu icon
import { useIsMobile } from "@/hooks/use-mobile"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"

const menuItems = [
  { title: "Home", to: "/" },
  { title: "Conjugator", to: "/conjugator" },
  { title: "Flash Cards", to: "/flash-cards" },
  { title: "Grammar", to: "/grammar" },
  { title: "Phrasebook", to: "/phrasebook" },
  { title: "Blog", to: "/blog" },
]

export function Nav() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open Menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-left">Learn Magyar Language</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8 pl-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                onClick={() => setIsOpen(false)} // Close menu on click
                className="text-lg font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

// --- DESKTOP VIEW ---
return (
  <div className="flex items-center justify-between px-4 py-2">
<Link to='/'>
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold  first:mt-0">
      Learn Magyar Language
    </h2>
</Link>
    {/* Right: Navigation */}
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to={item.to}>{item.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)
}