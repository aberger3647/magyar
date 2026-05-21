import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Home", to: "/" },
  { title: "Conjugator", to: "/conjugator" },
  { title: "Flash Cards", to: "/flash-cards" },
  { title: "Grammar", to: "/grammar" },
  { title: "Phrasebook", to: "/phrasebook" },
  { title: "Blog", to: "/blog" },
];

export function Nav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-black bg-[#facc15]">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-lg">
          Learn Magyar Language
        </Link>

        {isMobile ? (
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        ) : (
          <ul className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link to={item.to} className="hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isMobile && isOpen && (
        <ul className="border-t border-black bg-[#facc15]">
          {navItems.map((item) => (
            <li key={item.title} className="border-b border-black last:border-b-0">
              <Link
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 hover:bg-[#eab308]"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
