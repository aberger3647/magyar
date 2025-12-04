import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavLinksProps {
  isMobile: boolean;
  toggleNavbar?: () => void;
}

const NavLinks = ({ isMobile, toggleNavbar }: NavLinksProps) => {
  return (
    <>
      <li className={`${isMobile ? "w-full py-3" : ""}`}>
        <NavLink
          to="/"
          className={`${isMobile ? "block text-center" : ""}`}
          onClick={toggleNavbar}
        >
          Home
        </NavLink>
      </li>
      <li className={`${isMobile ? "w-full py-3" : ""}`}>
        <NavLink
          to="/conjugator"
          className={`${isMobile ? "block text-center" : ""}`}
          onClick={toggleNavbar}
        >
          Conjugator
        </NavLink>
      </li>
    </>
  );
};

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSmallScreen = width <= 768;

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-20 mx-auto flex h-16 items-center justify-between p-4">
        <NavLink to="/">
          <h2 className="text-2xl">Learn Magyar</h2>
        </NavLink>

        <ul className="hidden md:flex gap-4">
          <NavLinks isMobile={false} />
        </ul>

        <div className="md:hidden flex items-center">
          <button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>

      {isOpen && isSmallScreen && (
        <ul className="flex flex-col items-center bg-white">
          <NavLinks isMobile={true} toggleNavbar={toggleNavbar} />
        </ul>
      )}
    </>
  );
};
